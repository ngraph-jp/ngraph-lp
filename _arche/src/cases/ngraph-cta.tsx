// 一覧と各社ページの最後に置く、ngraph.jp の AI導入支援への案内（2026-10-18 本人「5を入れて」）。
// 文言は /fde/ に書いてあること（エンジニアが現場に入り、業務・判断・使っているデータを見てから組み込む）だけで作る。
// FDE の現場でアルケーの採点をしている、とは書かない（事実ではない）。
import { useLocale } from "@/lib/i18n/context";

export function NgraphCta() {
  const { locale } = useLocale();
  const en = locale === "en";
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <p className="text-xs font-bold tracking-[0.3em] text-primary">{en ? "NGRAPH — AI ADOPTION SUPPORT" : "NGRAPH — AI導入支援"}</p>
      <h2 className="mt-2 [font-family:var(--font-serif)] text-lg sm:text-xl font-bold leading-[1.5] text-foreground [text-wrap:balance]">
        {en ? "We start AI adoption by understanding how your business is built" : "事業を構造でつかむところから、AI導入に入ります"}
      </h2>
      <p className="mt-2 text-[15px] leading-[1.9] text-foreground">
        {en ? "At NGraph, engineers come into your workplace, look at your work, decisions and the data you use, and then build AI in. We don't stop at teaching you how to use it: we leave AI in a form your team keeps using." : "NGraphは、エンジニアが御社の現場に入り、業務・判断・使っているデータを見てからAIを組み込みます。使い方を教えて終わりではなく、現場で使われる状態をつくって残します。"}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={en ? "/en/fde/" : "/fde/"} className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity">
          {en ? "See AI Adoption Support (FDE) →" : "AI導入支援を見る →"}
        </a>
        <a href={en ? "/en/entry" : "/entry"} className="inline-flex items-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground hover:border-primary hover:text-primary transition-colors">
          {en ? "Free consultation" : "無料で相談する"}
        </a>
      </div>
    </section>
  );
}
