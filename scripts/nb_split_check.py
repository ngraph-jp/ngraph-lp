#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""句ごとの箱（.nb）が幅に入らず、箱の中で割れていないかを、ブラウザで実際に描いて調べる。

2026-11-07 髙橋さんのiPhoneで /fde/ の見出しが「AIを、／業務の／成果に変える。」と3行に割れていた
（本人「こういう個所結構あるな」）。句を nb で包んだ見出しは、級数が大きすぎて句が1行に入らないと
箱の中で無理に折れ、意図しない位置で割れる。orphan_punct_check は「句読点だけの行」しか見ないので、
句そのものが割れる方はここで見る。幅はパソコン・タブレット・スマホ2種（390＝iPhone標準、375＝小さめ）。

対象: git が持っている .html のうち、ブログ記事・部品・試作を除くページ（ブログは一覧だけ）。
使い方: python scripts/orphan_punct_check.py   （NG があれば exit 1）
"""
import functools
import http.server
import os
import subprocess
import sys
import threading

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIDTHS = (1280, 768, 390, 375)

# 各テキストを1文字ずつ測り、行ごとにまとめ、句読点・閉じかっこだけの行を探す
JS = r"""() => {
  // 句ごとの箱（.nb＝その中では折り返さない前提の箱）が、幅に入らず箱の中で2行以上に割れていないか
  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('.nb')) {
    if (el.closest('script,style,svg,noscript,[aria-hidden="true"],.sr-only,pre,code')) continue;
    const cs = getComputedStyle(el);
    // inline の nb は「普通に折り返してよい」とSPで外したもの。inline-block（＝句を1行に保つ箱）だけ見る
    if (cs.display !== 'inline-block') continue;
    // 英語は単語の間で折り返るのが普通なので見ない（日本語の句の箱だけ）
    if (!/[぀-ヿ一-鿿]/.test(el.textContent)) continue;
    if (cs.visibility === 'hidden' || !el.offsetParent && cs.position !== 'fixed') continue;
    const lines = new Map();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let t;
    while ((t = walker.nextNode())) {
      const s = t.nodeValue;
      for (let i = 0; i < s.length; i++) {
        if (!s[i].trim()) continue;
        const r = document.createRange(); r.setStart(t, i); r.setEnd(t, i + 1);
        const rect = r.getClientRects()[0];
        if (!rect || !rect.width) continue;
        const key = Math.round(rect.top / 4);
        lines.set(key, (lines.get(key) || '') + s[i]);
      }
    }
    if (lines.size < 2) continue;
    const blk = el.closest('h1,h2,h3,h4,h5,h6,p,li,dt,dd,td,th,figcaption,blockquote,div') || el;
    const tag = /^H\d$/.test(blk.tagName) || /title|tagline|h1|h2|heading|lead/i.test(blk.className) ? '見出し' : '本文';
    const txt = [...lines.values()].join('／');
    const key = tag + txt;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(`[${tag}] ${txt}  ← ${(blk.textContent || '').replace(/\s+/g, '').slice(0, 30)}`);
  }
  // 句の箱を使っている見出しで、箱の外に置かれた日本語（＝どこでも折れる）を拾う
  for (const h of document.querySelectorAll('h1,h2,h3')) {
    if (!h.querySelector('.nb')) continue;
    if (h.closest('svg,[aria-hidden="true"],.sr-only')) continue;
    if (getComputedStyle(h).display === 'none' || !h.offsetParent) continue;
    const w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    let t; const loose = [];
    while ((t = w.nextNode())) {
      if (!/[぀-ヿ一-鿿]/.test(t.nodeValue)) continue;
      if (t.parentElement.closest('.nb')) continue;
      loose.push(t.nodeValue.trim());
    }
    if (!loose.length) continue;
    const key = 'loose' + h.textContent;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(`[見出し] 句の箱の外：「${loose.join('」「')}」  ← ${h.textContent.replace(/\s+/g, '').slice(0, 30)}`);
  }
  // 1行に収まるのに2行以上になっている見出し（<br>・幅の上限で無理に割っている）。2026-11-07「1行でいけるのにわざわざ2行にしてたりしない？」
  for(const h of document.querySelectorAll('h1,h2,h3')){
 if(h.closest('svg,[aria-hidden="true"],.sr-only,footer,header,[data-keep-lines]'))continue; // data-keep-lines＝意図して行を組んだ見出し（トップのロゴ代わりの見出し）
 const cs=getComputedStyle(h); if(cs.display==='none'||!h.offsetParent)continue;
 if(!/[぀-ヿ一-鿿]/.test(h.textContent))continue;
 const lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.4;
 const lines=Math.round(h.getBoundingClientRect().height/lh); if(lines<2)continue;
 const hasBr=!!h.querySelector('br');
 const saved=h.style.cssText; const kids=[...h.querySelectorAll('*')].map(e=>[e,e.style.cssText]);
 h.style.whiteSpace='nowrap'; h.style.width='max-content'; h.style.maxWidth='none';
 kids.forEach(([e])=>{if(e.tagName==='BR'){e.style.display='none';return;}e.style.whiteSpace='nowrap'; if(getComputedStyle(e).display==='block')e.style.display='inline'});
 const need=h.getBoundingClientRect().width;
 h.style.cssText=saved; kids.forEach(([e,c])=>e.style.cssText=c);
 const hw=h.getBoundingClientRect().width; const pc=getComputedStyle(h.parentElement); const pd=pc.display; const pw=(cs.maxWidth!=='none'&&!/flex|grid/.test(pd))?h.parentElement.clientWidth-parseFloat(pc.paddingLeft)-parseFloat(pc.paddingRight):hw;
 if(need<=Math.max(hw,pw)+0.5) out.push('[見出し] 1行に入るのに2行以上：'+(hasBr?'[br] ':'')+`${h.tagName}.${h.className} 1行に要る${Math.round(need)}px／見出し幅${Math.round(hw)}／親${Math.round(pw)} max-width=${cs.maxWidth} fs=${cs.fontSize}: ${h.textContent.replace(/\s+/g,'').slice(0,30)}`);
}
  return out;
}"""

NG_SAMPLE = '<h1 style="width:300px;font-size:36px"><span class="nb" style="display:inline-block;overflow-wrap:anywhere">業務の成果に変える。</span></h1>'
OK_SAMPLE = '<h1 style="width:400px;font-size:36px"><span class="nb" style="display:inline-block">業務の成果に変える。</span></h1>'


def pages():
    out = subprocess.run(["git", "ls-files", "*.html"], cwd=ROOT, capture_output=True, text=True, encoding="utf-8").stdout.split()
    keep = []
    for p in out:
        if p.startswith(("_", ".", "scripts/", "figures/", "cases/", "en/cases/")) or "/_" in p:
            continue
        if p.startswith(("blog/", "en/blog/")) and not p.endswith("index.html"):
            continue
        keep.append(p)
    return keep


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def main():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("SKIP: playwright が無いので実測できない（pip install playwright）")
        return 0
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    port = srv.server_address[1]
    bad = []
    targets = pages()
    with sync_playwright() as p:
        try:
            b = p.chromium.launch(channel="msedge")
        except Exception:
            b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        pg.set_content("<html lang=ja><meta charset=utf-8><body>" + NG_SAMPLE)
        ng = pg.evaluate(JS)
        pg.set_content("<html lang=ja><meta charset=utf-8><body>" + OK_SAMPLE)
        ok = pg.evaluate(JS)
        if not ng or ok:
            print("nb_split_check の自己テストに失敗（検査が壊れている）", ng, ok)
            return 1
        for w in WIDTHS:
            pg.set_viewport_size({"width": w, "height": 900})
            for t in targets:
                pg.goto("http://127.0.0.1:%d/%s?noreveal" % (port, t), wait_until="networkidle")
                pg.evaluate("document.fonts && document.fonts.ready")
                for x in pg.evaluate(JS):
                    bad.append("%s（幅%d）: %s" % (t, w, x))
        b.close()
    srv.shutdown()
    if bad:
        print("見出しの割れ方が悪い %d 件（級数をSPで下げる・句を短く分ける・<br>や幅の上限を外す）" % len(bad))
        for x in bad:
            print("  - " + x)
        return 1
    print("OK: 割れている句の箱は無い（%d ページ × %d 幅）" % (len(targets), len(WIDTHS)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
