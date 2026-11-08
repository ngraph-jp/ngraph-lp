import type { ReactNode } from "react";
import { getArcheLocale } from "./i18n";
// nicomachos のパスを ngraph.jp のパスへ。対話（/signup）は ngraph.jp に無いので出さない。
// 英語のページでは /en/ の側へ向ける（2026-11-08）
const HIDE = ["/signup", "/login"];
function map(href: string): string {
  const en = getArcheLocale() === "en" ? "/en" : "";
  if (href === "/") return `${en}/`;
  if (href === "/cases") return `${en}/cases/`;
  if (href.startsWith("/cases/")) return `${en}${href.endsWith("/") ? href : `${href}/`}`;
  return href;
}
export function LocaleLink({ href, children, className, ...rest }: { href: string; children?: ReactNode; className?: string; [k: string]: unknown }) {
  if (HIDE.includes(href)) return null;
  return <a href={map(href)} className={className} {...(rest as object)}>{children}</a>;
}
export default LocaleLink;
