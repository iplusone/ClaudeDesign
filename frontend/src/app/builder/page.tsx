import Link from "next/link";

const templates = [
  {
    id: "engineer-training",
    name: "エンジニア育成LP",
    desc: "未経験者向けのエンジニア育成・教育サービスに特化したLP",
    sections: ["Hero", "Problems", "Service", "Curriculum", "Process", "FAQ", "Contact"],
    color: "#1951A5",
  },
  {
    id: "saas",
    name: "SaaS LP",
    desc: "ソフトウェアサービスの機能・料金・導入事例を訴求するLP",
    sections: ["Hero", "Features", "How it works", "Pricing", "FAQ", "Contact"],
    color: "#0f766e",
  },
  {
    id: "recruitment",
    name: "採用LP",
    desc: "求人・採用特化。カルチャー・待遇・選考フローを伝えるLP",
    sections: ["Hero", "Culture", "Benefits", "Team", "Process", "FAQ", "Contact"],
    color: "#7c3aed",
  },
  {
    id: "corporate",
    name: "コーポレートLP",
    desc: "会社紹介・信頼訴求。事業内容・実績・チームを伝えるLP",
    sections: ["Hero", "About", "Service", "Team", "News", "Contact"],
    color: "#b45309",
  },
];

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1951A5] to-[#458BF5] flex items-center justify-center">
            <span className="text-white text-xs font-black">CD</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-[#1951A5]">Claude Design Builder</h1>
            <p className="text-[10px] text-gray-400">テンプレートを選ぶだけで、完成に近いサイトデザインを生成</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-bold text-[#2F73D9] tracking-widest uppercase mb-3">Step 1</p>
          <h2 className="text-3xl font-black text-[#1951A5] mb-3">テンプレートを選ぶ</h2>
          <p className="text-gray-500 text-sm">
            テンプレートにはカラー・コピー・セクション構成がすべてプリセット済みです。<br />
            選んだあとに変えたい項目だけ上書きして、そのまま生成できます。
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {templates.map((t) => (
            <Link key={t.id} href={`/builder/${t.id}`}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#C7DCFC] transition-all p-7 h-full flex flex-col cursor-pointer group">
                {/* Color bar */}
                <div className="w-full h-1.5 rounded-full mb-6" style={{ backgroundColor: t.color }} />

                <h3 className="text-lg font-black text-[#333] mb-2 group-hover:text-[#1951A5] transition-colors">
                  {t.name}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1">{t.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {t.sections.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-400 border border-gray-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white text-center transition-opacity group-hover:opacity-90"
                  style={{ backgroundColor: t.color }}
                >
                  このテンプレートを使う →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
