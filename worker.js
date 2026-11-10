// ngraph.jp Worker: /api/* をFunctionsへ、その他は静的アセットへ
import { onRequestPost as ask } from './functions/api/ask.js';

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    // 取引先チェックは 2026-10-19 に公開を終え、社内のスキルだけで使う（functions/ のコードは社内から呼ぶ）。
    if (pathname === '/check' || pathname === '/check/' || pathname === '/api/kcheck' || pathname === '/api/lead') {
      return gone();
    }
    if (pathname === '/api/ask') {
      if (request.method === 'POST') return ask({ request, env });
      return methodNotAllowed();
    }
    return injectJpWrap(await env.ASSETS.fetch(request));
  },
};

// 日本語の折返し（js/jp-wrap.js）を全HTMLの <head> 末尾に差し込む。
// 記事97本＋今後の記事にタグを書かずに済ませるため、配信時に付ける（2026-09-05）
const injectJpWrap = (res) => {
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('text/html')) return res;
  return new HTMLRewriter()
    .on('head', { element(el) {
      el.prepend(ME_OPTOUT, { html: true });
      el.append('<script defer src="/js/jp-wrap.js?v=4"></script>', { html: true });
    } })
    .transform(res);
};

// 自分たちの端末をアクセス集計（GA）から外すスイッチ（2026-11-10）。
// その端末で一度 https://ngraph.jp/?ng_me=1 を開くと、以後その端末・そのブラウザは GA に送らない。戻すのは ?ng_me=0。
// GA のタグより先に動かす必要があるので <head> の先頭に差し込む。
const ME_OPTOUT = `<script>try{var q=new URLSearchParams(location.search).get('ng_me');if(q==='1'){localStorage.setItem('ng_me','1');alert('この端末をアクセス集計から外しました')}if(q==='0'){localStorage.removeItem('ng_me');alert('この端末をアクセス集計に戻しました')}if(localStorage.getItem('ng_me'))window['ga-disable-G-L96HMXRK1D']=true}catch(e){}</script>`;

const gone = () => new Response('<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>公開を終了しました | 株式会社NGraph</title><p style="font-family:sans-serif;padding:40px 20px;line-height:2">取引先チェックの公開は終了しました。<br><a href="/">NGraph トップへ</a></p>', {
  status: 410,
  headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
});

const methodNotAllowed = () => new Response(JSON.stringify({ error: 'POSTのみ利用できます' }), {
  status: 405,
  headers: { 'content-type': 'application/json; charset=utf-8', allow: 'POST', 'cache-control': 'no-store' },
});
