// 元のアルケー画面を ngraph.jp/cases/ に静的に書き出す。
//   1. vite build（ブラウザ用 JS/CSS）  2. vite build --ssr（HTML を作る用）
//   3. 一覧と各社のページを HTML にして ../cases/ に置く（ブラウザで同じ画面として動き出す）
// その後 ngraph-lp で `python scripts/sync_chrome.py` を流してヘッダー・フッターを入れる。
import { build } from "vite";
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

const OUT = "../cases";
const SITE = "https://ngraph.jp";

await build({ logLevel: "warn" });
await build({ logLevel: "warn", build: { ssr: "src/entry-server.tsx", outDir: "dist/server", emptyOutDir: true, rollupOptions: { input: "src/entry-server.tsx" } } });

const server = await import(pathToFileURL("dist/server/entry-server.js").href + `?t=${Date.now()}`);
const assets = readdirSync("dist/client");
const js = assets.find((f) => /^arche-.*\.js$/.test(f));
const css = assets.find((f) => /^arche-.*\.css$/.test(f));
if (!js || !css) throw new Error("ビルド結果に arche-*.js / arche-*.css が無い");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// 検索・AIがページの種類と会社名を読めるように、構造化データ（JSON-LD）を各ページに入れる（2026-10-23）
const ORG = { "@type": "Organization", "@id": `${SITE}/#organization`, name: "株式会社NGraph", url: `${SITE}/` };
const crumbs = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE}${path}` })),
});
const ldTag = (graph) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`;

function page({ title, desc, path, body, slug, ld, lang = "ja" }) {
  const jaPath = path.replace(/^\/en\//, "/"), enPath = lang === "en" ? path : `/en${path}`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-L96HMXRK1D"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-L96HMXRK1D');
</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:site_name" content="${lang === "en" ? "NGraph Inc." : "株式会社NGraph"}">
<meta property="og:locale" content="${lang === "en" ? "en_US" : "ja_JP"}">
<meta property="og:image" content="${SITE}/assets/ogp.jpg?v=3">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${SITE}${path}">
<link rel="alternate" hreflang="ja" href="${SITE}${jaPath}">
<link rel="alternate" hreflang="en" href="${SITE}${enPath}">
<link rel="alternate" hreflang="x-default" href="${SITE}${jaPath}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Zen+Old+Mincho:wght@400;600;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet">
<style>
/* ngraph.jp 共通CSSは「ngraph」層に入れる。元のアルケーの部品（utilities）より弱く、
   Tailwind の初期化（base）より強い。層に入れないと共通CSSの *{margin:0;padding:0} が
   元の画面の余白を全部消す（2026-10-17 実測）。 */
@layer theme, base, ngraph, components, utilities;
@import url("/css/ngraph-zen.css?v=14") layer(ngraph);
@import url("/css/sp.css?v=7") layer(ngraph);
</style>
<link rel="stylesheet" href="/cases/_assets/${css}">
${ldTag(ld)}
</head>
<body>
<header class="header scrolled"></header>
<div class="arche-page bg-background"><div id="arche-root"${slug ? ` data-slug="${esc(slug)}"` : ""}>${body}</div></div>
<footer class="footer"></footer>
<script type="module" src="/cases/_assets/${js}"></script>
</body>
</html>
`;
}

// 日本語（/cases/）と英語（/en/cases/）の2つを書き出す（2026-11-08 本人「企業の構造分析って英語もあるよね？」→「作って」）。
// JS/CSS は /cases/_assets/ の1組を両方で使う。英語の文章は元データの *En（全133社にある）。
rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/_assets`, { recursive: true });
cpSync("dist/client", `${OUT}/_assets`, { recursive: true });
const OUT_EN = "../en/cases";
rmSync(OUT_EN, { recursive: true, force: true });

const n = server.COUNT;
const slugs = server.slugs();
const ORG_EN = { ...ORG, name: "NGraph Inc." };
const T = {
  ja: {
    dir: OUT, base: "/cases/", home: "/", org: ORG,
    listTitle: "アルケー — 企業の構造分析 | 株式会社NGraph",
    listDesc: `アルケーが世界を変えた企業${n}社を12項目×3軸で採点。NCG（Nicomachos Company Graph）100点満点、存続ライン47点、卓越ライン75点。`,
    listName: "アルケー — 企業の構造分析", crumbHome: "ホーム", crumbList: "企業の構造分析",
    name: (m) => m.name,
    title: (m) => `${m.name} | アルケー — 企業の構造分析 | 株式会社NGraph`,
    desc: (m) => `${m.name}（NCG ${m.score}/100点）${m.insight}`,
    headline: (m) => `${m.name}の企業の構造分析（NCG ${m.score}/100点）`,
  },
  en: {
    dir: OUT_EN, base: "/en/cases/", home: "/en/", org: ORG_EN,
    listTitle: "Arche — Companies Deconstructed | NGraph Inc.",
    listDesc: `Arche scores ${n} companies that changed the world on 12 items across 3 axes. NCG (Nicomachos Company Graph): out of 100, survival line 47, excellence line 75.`,
    listName: "Arche — Companies Deconstructed", crumbHome: "Home", crumbList: "Company Analysis",
    name: (m) => m.nameEn || m.name,
    title: (m) => `${m.nameEn || m.name} | Arche — Companies Deconstructed | NGraph Inc.`,
    desc: (m) => `${m.nameEn || m.name} (NCG ${m.score}/100) ${m.insightEn || ""}`.trim(),
    headline: (m) => `Structural analysis of ${m.nameEn || m.name} (NCG ${m.score}/100)`,
  },
};
const cut = (d) => (d.length > 156 ? d.slice(0, 155) + "…" : d);
for (const lang of ["ja", "en"]) {
  const t = T[lang];
  mkdirSync(t.dir, { recursive: true });
  writeFileSync(`${t.dir}/index.html`, page({
    lang, title: t.listTitle, desc: t.listDesc, path: t.base,
    body: server.render({ kind: "list" }, lang),
    ld: [
      { "@type": "CollectionPage", "@id": `${SITE}${t.base}#page`, url: `${SITE}${t.base}`, name: t.listName, inLanguage: lang, publisher: t.org },
      crumbs([[t.crumbHome, t.home], [t.crumbList, t.base]]),
    ],
  }));
  for (const slug of slugs) {
    const m = server.meta(slug);
    mkdirSync(`${t.dir}/${slug}`, { recursive: true });
    const d = t.desc(m);
    writeFileSync(`${t.dir}/${slug}/index.html`, page({
      lang, title: t.title(m), desc: cut(d), path: `${t.base}${slug}/`,
      body: server.render({ kind: "detail", slug }, lang),
      slug,
      ld: [
        {
          "@type": "Article",
          "@id": `${SITE}${t.base}${slug}/#article`,
          url: `${SITE}${t.base}${slug}/`,
          headline: t.headline(m),
          description: d,
          inLanguage: lang,
          image: `${SITE}/assets/ogp.jpg?v=3`,
          about: { "@type": "Organization", name: m.name, ...(m.nameEn && m.nameEn !== m.name ? { alternateName: m.nameEn } : {}) },
          author: t.org,
          publisher: t.org,
          isPartOf: { "@type": "CollectionPage", "@id": `${SITE}${t.base}#page` },
        },
        crumbs([[t.crumbHome, t.home], [t.crumbList, t.base], [t.name(m), `${t.base}${slug}/`]]),
      ],
    }));
  }
}
// 元ソースの指紋を残す（scripts/arche_check.py が「複写を直したのに作り直していない」を止める）
const h = createHash("sha256");
// 改行は LF に揃えてから数える（git の autocrlf で CRLF に戻っても指紋が変わらないように）
for (const f of readdirSync("src/cases").sort()) h.update(f).update(readFileSync(`src/cases/${f}`, "utf-8").replace(/\r\n/g, "\n"));
writeFileSync(`${OUT}/_assets/build.json`, JSON.stringify({ orig_sha256: h.digest("hex"), pages: slugs.length }, null, 1));

// sitemap.xml の cases 区画を作り直す
const SM = "../sitemap.xml", A = "<!-- cases:start -->", B = "<!-- cases:end -->";
const today = new Date().toISOString().slice(0, 10);
const NL = "\n";
const block = A + NL + ["/cases/", ...slugs.map((s) => `/cases/${s}/`), "/en/cases/", ...slugs.map((s) => `/en/cases/${s}/`)]
  .map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join(NL) + NL + "  " + B;
let sm = readFileSync(SM, "utf-8");
sm = sm.includes(A) ? sm.slice(0, sm.indexOf(A)) + block + sm.slice(sm.indexOf(B) + B.length) : sm.replace("</urlset>", "  " + block + NL + "</urlset>");
writeFileSync(SM, sm);
console.log(`cases/ と en/cases/ に一覧1＋各社${slugs.length}ページずつ（データ${n}件）を書き出し、sitemap.xml を更新しました`);
