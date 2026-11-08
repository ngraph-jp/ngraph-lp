// ngraph.jp では日本語（/cases/）と英語（/en/cases/）の2つを書き出す（2026-11-08）。
// 書き出し（SSR）は setArcheLocale で切り替え、ブラウザではページの <html lang> を読む。
type Locale = "ja" | "en";
let current: Locale =
  typeof document !== "undefined" && document.documentElement.lang === "en" ? "en" : "ja";
export function setArcheLocale(l: Locale): void {
  current = l;
}
export function getArcheLocale(): Locale {
  return current;
}
export function useLocale() {
  return { locale: current, setLocale: () => {} };
}
