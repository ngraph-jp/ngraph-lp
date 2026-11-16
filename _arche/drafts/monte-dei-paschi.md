# モンテ・デイ・パスキ・ディ・シエナ（下書き・未掲載）

2026-11-16 に書いた下書き。インテーザ・サンパオロからの買収提案が決着していなかったので、掲載を見送った。
決着したら situation と exit の理由を直してから、下の2つを `src/cases/case-studies-data.ts` に入れる（CASE_STUDIES の末尾と BONUS_MAP）。

## CASE_STUDIES に入れる分

```ts
  // 出典: https://www.gruppomps.it/en/about-us/history.html
  // 出典: https://uk.finance.yahoo.com/news/decline-near-fall-italys-monte-154229759.html
  // 出典: https://www.gruppomps.it/en/media-and-news/press-releases/pr-29-09-2025.html
  // 出典: https://www.boersen-zeitung.de/banken-finanzen/monte-dei-paschi-ceo-schweigt-zur-offerte
  // 出典: https://live.euronext.com/en/financial-news/italys-intesa-raises-mps-takeover-offer-price-and-warns-it-could-drop-bid
  {
    name: "モンテ・デイ・パスキ・ディ・シエナ",
    nameEn: "Banca Monte dei Paschi di Siena",
    year: 1472,
    grade: "C",
    total: 36,
    tier: "gold",
    tierLabel: "554年",
    color: "#1f2a44",
    initial: "モ",
    flag: "🇮🇹",
    axes: { society: 3, customer: 3, self: 3 },
    axesScore: 33,
    insight: "1472年にシエナで生まれ、現存する世界最古の銀行とされる。2017年に国の資金で救われ、その後立ち直った",
    insightEn: "Born in Siena in 1472 and regarded as the world's oldest surviving bank. It was rescued with state money in 2017 and has since recovered.",
    situation: "1472年、シエナ共和国の議決で、困窮した人に7.5%の利子で貸す公営の質屋「モンテ・ピオ」として生まれた。1624年の改革でトスカーナ大公が預金者に国の保証を与え、その裏づけになったマレンマの牧草地（パスキ）の収入が行名の由来になった。1995年に株式会社と財団に分かれ、1999年にミラノ証券取引所に上場した。2007年11月、アントンヴェネタ銀行を現金90億ユーロで買うと決める。売り手のサンタンデールが数か月前に払った額は66億ユーロだった。その後、のれんの減損と不良債権で大きな赤字が続き、2013年にはデリバティブ取引3件の損失7億3,000万ユーロが表に出た。増資を繰り返しても足りず、2017年に国が54億ユーロを出して株式の68%を持った。国は2023年から持ち分を売り、2026年11月の時点で4.9%。2025年9月にはメディオバンカの株式の86.3%を取得した。2026年にはインテーザ・サンパオロから買収提案を受けており、同年11月の時点で決着していない。",
    situationEn: "It began in 1472, by resolution of the Republic of Siena, as the Monte Pio, a public pawn lender charging the needy 7.5% interest. In the reform of 1624 the Grand Duke of Tuscany gave depositors a state guarantee backed by the revenues of the Maremma pastures, the 'Paschi' of the name. In 1995 it was split into a joint-stock bank and a foundation, and in 1999 it listed in Milan. In November 2007 it agreed to buy Banca Antonveneta for 9 billion euros in cash; the seller, Santander, had paid 6.6 billion a few months earlier. Goodwill writedowns and bad loans then produced years of heavy losses, and in 2013 losses of 730 million euros on three derivatives trades came to light. Repeated capital raises were not enough, and in 2017 the state put in 5.4 billion euros for a 68% stake. The state began selling down in 2023 and held 4.9% as of November 2026. In September 2025 the bank acquired 86.3% of Mediobanca. In 2026 it received a takeover offer from Intesa Sanpaolo, unresolved as of November that year.",
    scores: {
      market: 4, problem: 3, solution: 3, team: 2, traction: 4, moat: 3,
      revenue: 4, financial: 2, efficiency: 3, exit: 4, timing: 1, insight: 3,
    },
    reasons: {
      market: "イタリアの銀行業。再編が続いており、買う側にも買われる側にもなる規模にある",
      problem: "困窮した人が金を借りられる先をつくる。1472年の出発点はそこにあった",
      solution: "7.5%の利子で貸す公営の質屋から、国の保証つきの預金を扱う銀行へ。仕組みとしては早く、堅かった",
      team: "2000年代の経営陣が身の丈を超える買収に進み、損失を抱えた。2022年に再建の専門家ルイジ・ロヴァリオがCEOに就いた",
      traction: "550年を超えて営業を続け、ギネス世界記録は「継続して営業する最古の銀行」とする",
      moat: "歴史と名前、国内の店舗網。ただし2010年代には、その名前が信用を守る力にならなかった",
      revenue: "2026年1〜9月の純利益は16億6,000万ユーロ（前年同期比21%増）。稼ぐ力は戻っている",
      financial: "2011年に47億ユーロ、2014年に53億ユーロの赤字。2014年の欧州の健全性審査で最下位。国の54億ユーロで生き延びた",
      efficiency: "2026年1〜9月の経費率は43%。再建後の数字はよいが、そこに至るまでに不良債権240億ユーロを切り離している",
      exit: "1999年に上場。国は持ち分を68%から4.9%まで売り、2026年にはインテーザ・サンパオロから買収提案を受けた",
      timing: "アントンヴェネタの買収を決めたのは2007年11月。売り手が数か月前に払った額に24億ユーロを上乗せした",
      insight: "困った人に貸すという出発点の考えは明快だった。その考えから離れた時期に、銀行は傾いた",
    },
    reasonsEn: {
      market: "Italian banking. Consolidation is under way, and the bank is of a size to be both a buyer and a target.",
      problem: "Giving people in need somewhere to borrow. That was the starting point in 1472.",
      solution: "From a public pawn lender at 7.5% interest to a bank taking state-guaranteed deposits. As a design it was early and sound.",
      team: "Management in the 2000s reached for an acquisition beyond its means and was left with the losses. Restructuring veteran Luigi Lovaglio became CEO in 2022.",
      traction: "In business for more than 550 years; Guinness World Records lists it as the oldest continuously operating bank.",
      moat: "History, a name and a domestic branch network. In the 2010s, though, the name did nothing to protect its credit.",
      revenue: "Net profit of 1.66 billion euros for the first nine months of 2026, up 21% on the year. The earning power is back.",
      financial: "Losses of 4.7 billion euros for 2011 and 5.3 billion for 2014. Worst performer in the 2014 Europe-wide stress tests. It survived on 5.4 billion of state money.",
      efficiency: "Cost-income ratio of 43% for the first nine months of 2026. The post-rescue numbers are good, but getting there meant shedding 24 billion euros of bad debts.",
      exit: "Listed in 1999. The state sold its stake down from 68% to 4.9%, and in 2026 Intesa Sanpaolo made an offer for it.",
      timing: "The Antonveneta purchase was agreed in November 2007, at 2.4 billion euros more than the seller had paid months before.",
      insight: "The founding idea, lending to people in need, was clear. The bank faltered in the years it moved away from it.",
    },
    virtue: "ディカイオシュネー（正義）",
    virtueEn: "Dikaiosyne (justice)",
    tierLabelEn: "554 years",
    survivalKey: "直近の生き残りは、自力ではなく救済による。2017年に国が54億ユーロを入れて68%を持たなければ、この銀行は続いていない。そのうえで言えるのは、救われたあとに不良債権を切り離し、黒字に戻り、国が持ち分を売れるところまで立て直したこと。それ以前の500年あまりを支えたのは、困窮者への貸付という公的な役目と、1624年に与えられた国の保証だった。この銀行は始まりから、公の後ろ盾と組になって続いてきた。",
    survivalKeyEn: "Its most recent survival came through rescue, not through its own strength. Had the state not put in 5.4 billion euros for 68% in 2017, the bank would not have continued. What can be said beyond that is that, once rescued, it shed its bad loans, returned to profit and recovered far enough for the state to sell down. What carried the five centuries before was a public purpose, lending to the needy, and the state guarantee granted in 1624. From the start, this bank has lasted in tandem with public backing.",
    otoraComment: "この銀行を長寿の手本として書くことは、私にはできない。550年続いた信用は、2007年の一つの買収から10年で、国に助けを求めるところまで崩れた。売り手が数か月前に66億ユーロで買ったものを、90億ユーロで買っている。長く続いたという事実は、次の判断が正しいことを少しも保証しない。むしろ「うちは潰れない」という気持ちが、判断を甘くすることがある。それでも私がこの銀行を載せておきたいのは、始まりが貧しい人のための質屋だったからだ。誰に、何のために貸すのか。その問いを見失ったときに傾き、助けられ、今は別の銀行に買われようとしている。あなたの会社の歴史は、次の判断を助けているだろうか、それとも鈍らせているだろうか。",
    otoraCommentEn: "I cannot write this bank up as a model of longevity. Credit that had lasted 550 years fell, within ten years of a single acquisition in 2007, to the point of asking the state for help. It paid 9 billion euros for something the seller had bought months earlier for 6.6 billion. Having lasted a long time guarantees nothing about the next decision. If anything, the feeling that 'we cannot fail' can make judgment slack. Still, I want this bank on the list, because it began as a pawn lender for the poor. To whom do you lend, and for what? When it lost sight of that question it faltered, was rescued, and now another bank is trying to buy it. Is your company's history helping its next decision, or dulling it?",
  },
```

## BONUS_MAP に入れる分

```ts
  "モンテ・デイ・パスキ・ディ・シエナ|1472|gold": { value: 6, reason: "[時間+影響] 554年+現存する世界最古の銀行とされる+ただし2017年に国が54億ユーロで救済しており満点にはしない", reasonEn: "[Time+Impact] 554yr+regarded as the world's oldest surviving bank+held below the top marks because the state had to rescue it with 5.4 billion euros in 2017" },
```
