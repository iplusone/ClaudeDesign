"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OutputPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const [brief, setBrief] = useState<Record<string, unknown> | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/design-brief").then(r => r.json()).then(setBrief);
  }, []);

  const handleDownload = () => {
    if (!brief) return;
    const blob = new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "design-brief.json";
    a.click();
  };

  const generatePrompt = () => {
    if (!brief) return "";
    const b = brief as any;
    return `【デザインシステム定義】
ブランド名: ${b.brand?.name}
キャッチコピー: ${b.brand?.tagline}
ターゲット: ${b.brand?.target}
トーン: ${(b.brand?.tones ?? []).join("、")}
避けたい印象: ${b.brand?.avoidTones}

カラー
  Primary:   ${b.colors?.primary}
  Secondary: ${b.colors?.secondary}
  Accent:    ${b.colors?.accent}
  背景:      ${b.colors?.heroBg}

【使用テンプレート】
${b.meta?.templateId}

【セクション別コピー】
■ Hero
  見出し: ${b.copy?.heroHeadline}
  サブ:   ${b.copy?.heroSubheadline}
  CTA:    ${b.copy?.heroCtaPrimary} / ${b.copy?.heroCtaSecondary}

■ Problems
  見出し: ${b.copy?.problemsHeading}
  ${(b.copy?.problems ?? []).map((p: any) => `${p.no}. ${p.title} — ${p.desc}`).join("\n  ")}

■ Service
  見出し: ${b.copy?.serviceHeading}
  ${(b.copy?.service ?? []).map((s: any) => `${s.tag}: ${s.title}`).join("\n  ")}

■ Curriculum
  見出し: ${b.copy?.curriculumHeading}
  ${(b.copy?.curriculum ?? []).map((c: any) => `${c.phase}: ${c.title}`).join("\n  ")}

■ FAQ
  ${(b.copy?.faq ?? []).map((f: any) => `Q: ${f.q}`).join("\n  ")}

■ CTA
  見出し: ${b.copy?.ctaHeadline}
  ボタン: ${b.copy?.ctaPrimary}

【デザイン上の注意】
- 初学者にとってわかりやすい情報階層にする
- 信頼感のある余白と整然としたレイアウトを維持する
- 先進性は出しつつ、過度に難しそうな印象は避ける
- 参考: https://ocl-ai.jp/`;
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1951A5] to-[#458BF5] flex items-center justify-center">
            <span className="text-white text-xs font-black">CD</span>
          </div>
          <h1 className="text-sm font-black text-[#1951A5]">Claude Design Builder</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-5">
        {/* 完了バナー */}
        <div className="bg-gradient-to-r from-[#1951A5] to-[#2F73D9] rounded-2xl p-7 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">✓</span>
            <h2 className="text-xl font-black">デザインブリーフが生成されました</h2>
          </div>
          <p className="text-white/70 text-sm">下のボタンから JSON をダウンロードするか、Claude Design 用プロンプトをコピーしてください。</p>
        </div>

        {/* アクションカード */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 space-y-3">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-gray-200 hover:border-[#1951A5] hover:bg-blue-50 transition-colors text-left group"
          >
            <div>
              <p className="text-sm font-bold text-gray-700 group-hover:text-[#1951A5]">design-brief.json をダウンロード</p>
              <p className="text-xs text-gray-400">バージョン管理・別プロジェクトへの流用に</p>
            </div>
            <span className="text-gray-300 group-hover:text-[#1951A5] text-lg">↓</span>
          </button>

          <button
            onClick={handleCopyPrompt}
            className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-gray-200 hover:border-[#1951A5] hover:bg-blue-50 transition-colors text-left group"
          >
            <div>
              <p className="text-sm font-bold text-gray-700 group-hover:text-[#1951A5]">
                {copied ? "✓ コピーしました" : "Claude Design プロンプトをコピー"}
              </p>
              <p className="text-xs text-gray-400">Claude Design に貼り付けるだけで使えます</p>
            </div>
            <span className="text-gray-300 group-hover:text-[#1951A5] text-lg">⎘</span>
          </button>
        </div>

        {/* JSON プレビュー */}
        {brief && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-500">design-brief.json プレビュー</p>
            </div>
            <pre className="px-6 py-5 text-[11px] text-gray-500 leading-relaxed overflow-x-auto max-h-80 bg-gray-50">
              {JSON.stringify(brief, null, 2)}
            </pre>
          </div>
        )}

        {/* ナビ */}
        <div className="flex gap-3">
          <Link
            href={`/builder/${templateId}`}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 text-center hover:border-gray-400 transition-colors"
          >
            ← 編集に戻る
          </Link>
          <Link
            href="/builder"
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 text-center hover:border-gray-400 transition-colors"
          >
            別のテンプレートを選ぶ
          </Link>
        </div>
      </main>
    </div>
  );
}
