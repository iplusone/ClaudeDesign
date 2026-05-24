"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type TemplateData = {
  id: string;
  name: string;
  brand: { name: string; tagline: string };
  colors: { primary: string; secondary: string; accent: string; heroBg: string; surface: string; text: string; muted: string };
  images: { logo: string; hero: string };
  copy: { heroHeadline: string; heroCtaPrimary: string };
};

const TEMPLATE_COLORS: Record<string, string> = {
  "engineer-training": "#1951A5",
  "saas":              "#0f766e",
  "recruitment":       "#7c3aed",
  "corporate":         "#b45309",
};

export default function CustomizePage() {
  const { templateId } = useParams<{ templateId: string }>();
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [tpl, setTpl] = useState<TemplateData | null>(null);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [primary, setPrimary] = useState("#1951A5");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [headline, setHeadline] = useState("");
  const [ctaPrimary, setCtaPrimary] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/template/${templateId}`)
      .then(r => r.json())
      .then((data: TemplateData) => {
        setTpl(data);
        setName(data.brand.name);
        setTagline(data.brand.tagline);
        setPrimary(data.colors.primary);
        setHeadline(data.copy.heroHeadline.replace(/\n/g, " "));
        setCtaPrimary(data.copy.heroCtaPrimary);
      });
  }, [templateId]);

  const handleLogoChange = (file: File) => {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleGenerate = async () => {
    if (!tpl) return;
    setSaving(true);
    try {
      let logoPath = tpl.images.logo;
      if (logoFile) {
        const fd = new FormData();
        fd.append("logo", logoFile);
        const res = await fetch("/api/upload-image", { method: "POST", body: fd });
        const json = await res.json();
        logoPath = json.logo ?? logoPath;
      }

      const brief = {
        meta: { version: "1.0", templateId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        brand: { ...tpl.brand, name, tagline },
        colors: { ...tpl.colors, primary },
        images: { ...tpl.images, logo: logoPath },
        copy: { ...tpl.copy, heroHeadline: headline, heroCtaPrimary: ctaPrimary },
      };

      await fetch("/api/design-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });

      router.push(`/builder/${templateId}/output`);
    } finally {
      setSaving(false);
    }
  };

  if (!tpl) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        読み込み中...
      </div>
    );
  }

  const themeColor = TEMPLATE_COLORS[templateId] ?? "#1951A5";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/builder" className="text-gray-400 hover:text-gray-600 text-sm">← 戻る</Link>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
              <span className="text-sm font-bold text-gray-700">{tpl.name}</span>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: themeColor }}
          >
            {saving ? "生成中..." : "生成する →"}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
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
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#2F73D9]"
              />
            </div>

            {/* キャッチコピー */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">キャッチコピー（タグライン）</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#2F73D9]"
              />
            </div>

            {/* メインカラー */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">メインカラー</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primary}
                  onChange={e => setPrimary(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={primary}
                  onChange={e => setPrimary(e.target.value)}
                  className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 font-mono focus:outline-none focus:border-[#2F73D9]"
                />
                <span className="text-xs text-gray-400">ボタン・見出しに使われる主色</span>
              </div>
            </div>

            {/* ロゴ */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">ロゴ</label>
              <div
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#2F73D9] transition-colors group"
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="logo" className="h-10 object-contain rounded" />
                    <span className="text-xs text-[#2F73D9] group-hover:underline">{logoFile?.name}</span>
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
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoChange(f); }}
              />
            </div>

            {/* メインキャッチ */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">メインキャッチコピー（Hero 見出し）</label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#2F73D9]"
              />
            </div>

            {/* CTA */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">メイン CTA ボタン</label>
              <input
                type="text"
                value={ctaPrimary}
                onChange={e => setCtaPrimary(e.target.value)}
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
            <span className="text-gray-400 text-lg">{advanced ? "▲" : "▼"}</span>
          </button>

          {advanced && (
            <div className="px-7 pb-7 border-t border-gray-50">
              <p className="text-sm text-gray-400 mt-5 text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                詳細設定は Phase 2 で実装予定です（Issue #6）
              </p>
            </div>
          )}
        </div>

        {/* 生成ボタン */}
        <button
          onClick={handleGenerate}
          disabled={saving}
          className="w-full py-4 rounded-2xl text-base font-black text-white transition-opacity hover:opacity-90 disabled:opacity-50 shadow-lg"
          style={{ backgroundColor: themeColor }}
        >
          {saving ? "生成中..." : "このまま生成する →"}
        </button>
      </main>
    </div>
  );
}
