// 国旗の絵文字（Windows では「US」のような文字で出る）を、日本語の国名にする
const NAMES: Record<string, string> = {
  US: "米国", JP: "日本", CN: "中国", IT: "イタリア", FR: "フランス", GB: "英国", DE: "ドイツ",
  SE: "スウェーデン", KR: "韓国", IN: "インド", BD: "バングラデシュ", AU: "オーストラリア",
  NL: "オランダ", CH: "スイス", DK: "デンマーク", CA: "カナダ", IL: "イスラエル", BR: "ブラジル",
  TW: "台湾", SG: "シンガポール", KE: "ケニア", FI: "フィンランド", ES: "スペイン",
  AT: "オーストリア", BE: "ベルギー", NO: "ノルウェー", GH: "ガーナ", BS: "バハマ",
  "GB-SCT": "スコットランド",
};

const NAMES_EN: Record<string, string> = {
  US: "USA", JP: "Japan", CN: "China", IT: "Italy", FR: "France", GB: "UK", DE: "Germany",
  SE: "Sweden", KR: "South Korea", IN: "India", BD: "Bangladesh", AU: "Australia",
  NL: "Netherlands", CH: "Switzerland", DK: "Denmark", CA: "Canada", IL: "Israel", BR: "Brazil",
  TW: "Taiwan", SG: "Singapore", KE: "Kenya", FI: "Finland", ES: "Spain",
  AT: "Austria", BE: "Belgium", NO: "Norway", GH: "Ghana", BS: "Bahamas",
  "GB-SCT": "Scotland",
};

// 国旗の絵文字から国のコードを取る（🇺🇸 → "US"、スコットランドの旗 🏴󠁧󠁢󠁳󠁣󠁴󠁿 → "GB-SCT"）
export function flagCode(flag?: string): string {
  if (!flag) return "";
  const cps = [...flag].map((ch) => ch.codePointAt(0) ?? 0);
  const regional = cps.filter((cp) => cp >= 0x1f1e6 && cp <= 0x1f1ff).map((cp) => String.fromCharCode(cp - 0x1f1e6 + 65)).join("");
  if (regional) return regional;
  const tag = cps.filter((cp) => cp >= 0xe0061 && cp <= 0xe007a).map((cp) => String.fromCharCode(cp - 0xe0061 + 65)).join("");
  return tag.length > 2 ? `${tag.slice(0, 2)}-${tag.slice(2)}` : tag;
}

export function countryName(flag?: string, locale: string = "ja"): string {
  const code = flagCode(flag);
  if (!code) return "";
  return (locale === "en" ? NAMES_EN : NAMES)[code] ?? code;
}

// 国旗の画像（public/flags/ に flag-icons の SVG を置いている・MIT）。絵文字の国旗は Windows で文字になるため画像で出す
export function FlagIcon({ flag, locale = "ja", className = "" }: { flag?: string; locale?: string; className?: string }) {
  const code = flagCode(flag);
  if (!code) return null;
  return (
    <img
      src={`/cases/_assets/flags/${code.toLowerCase()}.svg`}
      alt={countryName(flag, locale)}
      title={countryName(flag, locale)}
      width={16}
      height={12}
      loading="lazy"
      className={`inline-block w-4 h-3 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.12)] align-[-1px] ${className}`}
    />
  );
}
