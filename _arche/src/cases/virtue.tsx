"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// 徳目（詳細画面の「プロネーシス（実践知）」など）を押すと出る解説。
// 上の6つは judgment-foundation.tsx の六つの柱と同じ文。下の5つは『ニコマコス倫理学』の該当巻をもとに同じ調子で書いた。
// book は『ニコマコス倫理学』で主に論じられる巻（アリストテレス『ニコマコス倫理学』）。
interface VirtueInfo {
  ja: string; en: string;
  meaningJa: string; meaningEn: string;
  descJa: string; descEn: string;
  book: string;
}

const VIRTUES: Record<string, VirtueInfo> = {
  eudaimonia: {
    ja: "エウダイモニア", en: "Eudaimonia", meaningJa: "幸福", meaningEn: "Flourishing",
    descJa: "事業の目的は利益ではなく、関わる全員の「よく生きる」こと。",
    descEn: "The purpose of business is not profit, but helping everyone involved live well.",
    book: "1",
  },
  arete: {
    ja: "アレテー", en: "Arete", meaningJa: "卓越性", meaningEn: "Excellence",
    descJa: "自分の役割を最高の形で果たすこと。",
    descEn: "Performing one's role at the highest possible level.",
    book: "2",
  },
  mesotes: {
    ja: "メソテース", en: "Mesotes", meaningJa: "中庸", meaningEn: "The Golden Mean",
    descJa: "極端を避け、状況に応じた最善を重ねること。",
    descEn: "Avoiding extremes, accumulating context-appropriate best choices.",
    book: "2",
  },
  phronesis: {
    ja: "プロネーシス", en: "Phronesis", meaningJa: "実践知", meaningEn: "Practical Wisdom",
    descJa: "この状況・この人にとっての最善を見極める知恵。",
    descEn: "The wisdom to discern what is best for this situation and this person.",
    book: "6",
  },
  hexis: {
    ja: "ヘクシス", en: "Hexis", meaningJa: "習慣的卓越性", meaningEn: "Habituated Excellence",
    descJa: "日々の判断の積み重ねが、事業の性格を作る。",
    descEn: "Daily decisions accumulate into the character of a business.",
    book: "2",
  },
  philia: {
    ja: "フィリア", en: "Philia", meaningJa: "友愛", meaningEn: "Friendship",
    descJa: "取引先・従業員・顧客との信頼関係こそ最大の資産。",
    descEn: "Trust with partners, employees, and customers is the greatest asset.",
    book: "8・9",
  },
  andreia: {
    ja: "アンドレイア", en: "Andreia", meaningJa: "勇気", meaningEn: "Courage",
    descJa: "無謀と臆病のあいだで、恐れるべきものを見分けて踏み出すこと。",
    descEn: "Stepping forward between recklessness and cowardice, knowing what is truly worth fearing.",
    book: "3",
  },
  megalopsychia: {
    ja: "メガロプシキア", en: "Megalopsychia", meaningJa: "高邁", meaningEn: "Greatness of Soul",
    descJa: "大きなことに値する者が、自分をそのとおりに見積もること。虚栄でも卑屈でもない。",
    descEn: "Being worthy of great things and judging oneself accordingly, neither vain nor small-minded.",
    book: "4",
  },
  dikaiosyne: {
    ja: "ディカイオシュネー", en: "Dikaiosyne", meaningJa: "正義", meaningEn: "Justice",
    descJa: "それぞれにふさわしい分を渡し、自分は取りすぎないこと。",
    descEn: "Giving each their due and not taking more than one's share.",
    book: "5",
  },
  sophrosyne: {
    ja: "ソフロシュネー", en: "Sophrosyne", meaningJa: "節制", meaningEn: "Temperance",
    descJa: "欲に流されず、ほどよく求めること。",
    descEn: "Desiring in the right measure instead of being carried away by appetite.",
    book: "3",
  },
  sophia: {
    ja: "ソフィア", en: "Sophia", meaningJa: "知恵", meaningEn: "Wisdom",
    descJa: "変わらない根本の原理を知ること。個別の判断を担うプロネーシスと対になる。",
    descEn: "Knowledge of the unchanging first principles; the counterpart of phronesis, which handles particular decisions.",
    book: "6",
  },
};

// データの表記ゆれ（フロネーシス／メガロプシュキア／Megalopsuchia）を同じ徳目に寄せる
const ALIASES: Record<string, string> = {
  エウダイモニア: "eudaimonia", アレテー: "arete", メソテース: "mesotes",
  プロネーシス: "phronesis", フロネーシス: "phronesis", ヘクシス: "hexis", フィリア: "philia",
  アンドレイア: "andreia", メガロプシキア: "megalopsychia", メガロプシュキア: "megalopsychia",
  ディカイオシュネー: "dikaiosyne", ソフロシュネー: "sophrosyne", ソフィア: "sophia",
  megalopsuchia: "megalopsychia",
};

export function virtueInfo(label: string): VirtueInfo | null {
  const head = label.split(/[（(]/)[0].trim();
  const key = ALIASES[head] ?? ALIASES[head.toLowerCase()] ?? head.toLowerCase();
  return VIRTUES[key] ?? null;
}

/** 詳細画面の色つきヘッダーに置く徳目。押すと下に解説が開く（もう一度押すと閉じる） */
export function VirtueChip({ label, ja }: { label: string; ja: boolean }) {
  const [open, setOpen] = useState(false);
  const info = virtueInfo(label);
  if (!info) return <span className="inline-block rounded-md bg-white/15 px-2 py-0.5 text-xs font-bold">{label}</span>;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-xs font-bold hover:bg-white/25 transition-colors cursor-pointer"
      >
        {label}
        <ChevronDown className={`h-3 w-3 opacity-80 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div className="mt-2 rounded-lg bg-white/15 px-3 py-2.5 text-xs leading-relaxed text-white">
          <p className="font-bold">
            {ja ? `${info.ja}＝${info.meaningJa}` : `${info.en}: ${info.meaningEn}`}
            {ja && <span className="ml-1.5 font-normal text-white/75">{info.en}</span>}
          </p>
          <p className="mt-1 text-white/90">{ja ? info.descJa : info.descEn}</p>
          <p className="mt-1 text-white/70">
            {ja ? `アリストテレス『ニコマコス倫理学』第${info.book}巻` : `Aristotle, Nicomachean Ethics, Book ${info.book.replace("・", " & ")}`}
          </p>
        </div>
      )}
    </div>
  );
}
