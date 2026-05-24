"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Brief } from "@/types/brief";
import DetailedSettings from "./_components/DetailedSettings";

const THEME: Record<string, string> = {
  "engineer-training": "#1951A5",
  "saas":              "#0f766e",
  "recruitment":       "#7c3aed",
  "corporate":         "#b45309",
};

export default function CustomizePage() {
  const { templateId } = useParams<{ templateId: string }>();
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const themeColor = THEME[templateId] ?? "#1951A5";

  const [brief, setBrief] = useState<Brief | null>(null);
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [advanced, setAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/template/${templateId}`)
      .then(r => r.json())
      .then((data: Brief) => setBrief(data));
  }, [templateId]);

  const handleImageChange = (key: string, file: File, path: string) => {
    setImageFiles(prev => ({ ...prev, [key]: file }));
    setBrief(prev => prev ? { ...prev, images: { ...prev.images, [key]: path } } : prev);
  };

  const handleGenerate = async () => {
    if (!brief) return;
    setSaving(true);
    try {
      if (Object.keys(imageFiles).length > 0) {
        const fd = new FormData();
        Object.entries(imageFiles).forEach(([k, f]) => fd.append(k, f));
        await fetch("/api/upload-image", { method: "POST", body: fd });
      }
      await fetch("/api/design-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...brief,
          meta: { version: "1.0", templateId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        }),
      });
      router.push(`/builder/${templateId}/output`);
    } finally {
      setSaving(false);
    }
  };

  if (!brief) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">読み込み中...</div>;
  }

  const logoPreview = imageFiles["logo"] ? URL.createObjectURL(imageFiles["logo"]) : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/builder" className="text-gray-400 hover:text-gray-600 text-sm">← 戻る</Link>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
              <span className="text-sm font-bold text-gray-700">{brief.brand.name || "（サービス名未入力）"}</span>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: themeColor }}
          >
            {saving ? "生成中..." : "生成する →"}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-5">

        {/* よく変える項目 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-base font-black text-gray-800 mb-1">よく変える項目</h2>
          <p className="text-xs text-gray-400 mb-6">変えなければテンプレートのデフォルト値で生成されます</p>

          <div className="space-y-5">
            {/* サービス名 */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">サービス名</label>
              <input
                type="text"
                value={brief.brand.name}
                onChange={e => setBrief(b => b ? { ...b, brand: { ...b.brand, name: e.target.value } } : b)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#2F73D9]"
              />
            </div>

            {/* タグライン */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">キャッチコピー（タグライン）</label>
              <input
                type="text"
                value={brief.brand.tagline}
                onChange={e => setBrief(b => b ? { ...b, brand: { ...b.brand, tagline: e.target.value } } : b)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#2F73D9]"
              />
            </div>

            {/* メインカラー */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">メインカラー</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brief.colors.primary}
                  onChange={e => setBrief(b => b ? { ...b, colors: { ...b.colors, primary: e.target.value } } : b)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={brief.colors.primary}
                  onChange={e => setBrief(b => b ? { ...b, colors: { ...b.colors, primary: e.target.value } } : b)}
                  className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:border-[#2F73D9]"
                />
                <span className="text-xs text-gray-400">ボタン・見出しに使われる主色</span>
              </div>
            </div>

            {/* ロゴ */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">ロゴ</label>
              <div
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#2F73D9] transition-colors group min-h-[72px]"
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="logo" className="h-10 object-contain rounded" />
                    <div>
                      <p className="text-xs text-[#2F73D9]">{imageFiles["logo"]?.name}</p>
                      <p className="text-[10px] text-gray-400">クリックして変更</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-gray-300">
                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">クリックしてロゴをアップロード</p>
                      <p className="text-xs text-gray-300">PNG / SVG（透過推奨）</p>
                    </div>
                  </>
                )}
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageChange("logo", f, `/images/${f.name}`); }}
              />
            </div>

            {/* メインキャッチ */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">メインキャッチコピー（Hero 見出し）</label>
              <input
                type="text"
                value={brief.copy.heroHeadline.replace(/\n/g, " ")}
                onChange={e => setBrief(b => b ? { ...b, copy: { ...b.copy, heroHeadline: e.target.value } } : b)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#2F73D9]"
              />
            </div>

            {/* CTA */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">メイン CTA ボタン</label>
              <input
                type="text"
                value={brief.copy.heroCtaPrimary}
                onChange={e => setBrief(b => b ? { ...b, copy: { ...b.copy, heroCtaPrimary: e.target.value } } : b)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#2F73D9]"
              />
            </div>
          </div>
        </div>

        {/* 詳細設定 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setAdvanced(!advanced)}
            className="w-full flex items-center justify-between px-7 py-5 text-left hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="text-base font-black text-gray-800">詳細設定</p>
              <p className="text-xs text-gray-400 mt-0.5">全コピー・全画像・カラーシステム</p>
            </div>
            <span className="text-gray-400">{advanced ? "▲" : "▼"}</span>
          </button>

          {advanced && (
            <div className="px-7 pb-7 border-t border-gray-50">
              <DetailedSettings
                brief={brief}
                imageFiles={imageFiles}
                onBriefChange={setBrief}
                onImageChange={handleImageChange}
              />
            </div>
          )}
        </div>

        {/* 生成ボタン */}
        <button
          onClick={handleGenerate}
          disabled={saving}
          className="w-full py-4 rounded-2xl text-base font-black text-white hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg"
          style={{ backgroundColor: themeColor }}
        >
          {saving ? "生成中..." : "このまま生成する →"}
        </button>
      </main>
    </div>
  );
}
