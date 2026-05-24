"use client";
import { useState } from "react";
import type { Brief } from "@/types/brief";
import ImageUpload from "./ImageUpload";

type Tab = "copy" | "images" | "colors";

const COLOR_LABELS: { key: keyof Brief["colors"]; label: string }[] = [
  { key: "primary",   label: "Primary（メインカラー）" },
  { key: "secondary", label: "Secondary（サブカラー）" },
  { key: "accent",    label: "Accent（アクセント）" },
  { key: "heroBg",    label: "Hero背景" },
  { key: "surface",   label: "カード背景" },
  { key: "text",      label: "本文テキスト" },
  { key: "muted",     label: "補助テキスト" },
];

interface Props {
  brief: Brief;
  imageFiles: Record<string, File>;
  onBriefChange: (b: Brief) => void;
  onImageChange: (key: string, file: File, path: string) => void;
}

function Field({ label, value, onChange, multiline }: {
  label: string; value: string;
  onChange: (v: string) => void; multiline?: boolean;
}) {
  const cls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#2F73D9]";
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} className={`${cls} resize-none`} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} className={cls} />
      }
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors text-left"
      >
        {title}
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-4 pb-4 space-y-3 border-t border-gray-50">{children}</div>}
    </div>
  );
}

export default function DetailedSettings({ brief, imageFiles, onBriefChange, onImageChange }: Props) {
  const [tab, setTab] = useState<Tab>("copy");

  const setColors = (key: keyof Brief["colors"], val: string) =>
    onBriefChange({ ...brief, colors: { ...brief.colors, [key]: val } });

  const setCopy = (key: keyof Brief["copy"], val: unknown) =>
    onBriefChange({ ...brief, copy: { ...brief.copy, [key]: val } });

  const setImages = (key: keyof Brief["images"], val: string) =>
    onBriefChange({ ...brief, images: { ...brief.images, [key]: val } });

  const setProblem = (i: number, field: "title" | "desc", val: string) => {
    const updated = brief.copy.problems.map((p, idx) => idx === i ? { ...p, [field]: val } : p);
    setCopy("problems", updated);
  };

  const setService = (i: number, field: keyof Brief["copy"]["service"][0], val: string) => {
    const updated = brief.copy.service.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    setCopy("service", updated);
  };

  const setCurriculum = (i: number, field: keyof Brief["copy"]["curriculum"][0], val: string) => {
    const updated = brief.copy.curriculum.map((c, idx) => idx === i ? { ...c, [field]: val } : c);
    setCopy("curriculum", updated);
  };

  const setFaq = (i: number, field: "q" | "a", val: string) => {
    const updated = brief.copy.faq.map((f, idx) => idx === i ? { ...f, [field]: val } : f);
    setCopy("faq", updated);
  };

  const addFaq = () => setCopy("faq", [...brief.copy.faq, { q: "", a: "" }]);

  const removeFaq = (i: number) => setCopy("faq", brief.copy.faq.filter((_, idx) => idx !== i));

  return (
    <div className="mt-4">
      {/* タブ */}
      <div className="flex gap-1 mb-4 bg-gray-50 rounded-xl p-1">
        {(["copy", "images", "colors"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
              tab === t ? "bg-white text-[#1951A5] shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {{ copy: "コピー", images: "画像", colors: "カラー" }[t]}
          </button>
        ))}
      </div>

      {/* コピータブ */}
      {tab === "copy" && (
        <div className="space-y-3">
          <Section title="Hero">
            <Field label="アイキャッチ（小文字）" value={brief.copy.heroEyebrow} onChange={v => setCopy("heroEyebrow", v)} />
            <Field label="メイン見出し" value={brief.copy.heroHeadline} onChange={v => setCopy("heroHeadline", v)} multiline />
            <Field label="サブコピー" value={brief.copy.heroSubheadline} onChange={v => setCopy("heroSubheadline", v)} multiline />
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA（メイン）" value={brief.copy.heroCtaPrimary} onChange={v => setCopy("heroCtaPrimary", v)} />
              <Field label="CTA（サブ）" value={brief.copy.heroCtaSecondary} onChange={v => setCopy("heroCtaSecondary", v)} />
            </div>
          </Section>

          <Section title="Problems（課題）">
            <Field label="セクション見出し" value={brief.copy.problemsHeading} onChange={v => setCopy("problemsHeading", v)} />
            <Field label="サブ説明" value={brief.copy.problemsSubheading} onChange={v => setCopy("problemsSubheading", v)} multiline />
            {brief.copy.problems.map((p, i) => (
              <div key={p.no} className="bg-gray-50 rounded-xl p-3 space-y-2">
                <p className="text-[10px] font-black text-[#2F73D9] tracking-widest">{p.no}</p>
                <Field label="タイトル" value={p.title} onChange={v => setProblem(i, "title", v)} />
                <Field label="説明" value={p.desc} onChange={v => setProblem(i, "desc", v)} />
              </div>
            ))}
          </Section>

          <Section title="Service（サービス内容）">
            <Field label="セクション見出し" value={brief.copy.serviceHeading} onChange={v => setCopy("serviceHeading", v)} />
            <Field label="サブ説明" value={brief.copy.serviceSubheading} onChange={v => setCopy("serviceSubheading", v)} multiline />
            {brief.copy.service.map((s, i) => (
              <div key={s.tag} className="bg-gray-50 rounded-xl p-3 space-y-2">
                <p className="text-[10px] font-black text-[#2F73D9] tracking-widest">{s.tag}</p>
                <Field label="タイトル" value={s.title} onChange={v => setService(i, "title", v)} />
                <Field label="説明" value={s.desc} onChange={v => setService(i, "desc", v)} multiline />
                <Field label="ポイント（改行区切り）" value={s.points} onChange={v => setService(i, "points", v)} multiline />
              </div>
            ))}
          </Section>

          <Section title="Curriculum（カリキュラム）">
            <Field label="セクション見出し" value={brief.copy.curriculumHeading} onChange={v => setCopy("curriculumHeading", v)} />
            <Field label="サブ説明" value={brief.copy.curriculumSubheading} onChange={v => setCopy("curriculumSubheading", v)} multiline />
            {brief.copy.curriculum.map((c, i) => (
              <div key={c.phase} className="bg-gray-50 rounded-xl p-3 space-y-2">
                <p className="text-[10px] font-black text-[#2F73D9] tracking-widest">{c.phase}</p>
                <Field label="タイトル" value={c.title} onChange={v => setCurriculum(i, "title", v)} />
                <Field label="説明" value={c.desc} onChange={v => setCurriculum(i, "desc", v)} multiline />
                <Field label="タグ（カンマ区切り）" value={c.tags} onChange={v => setCurriculum(i, "tags", v)} />
              </div>
            ))}
          </Section>

          <Section title="FAQ">
            <Field label="セクション見出し" value={brief.copy.faqHeading} onChange={v => setCopy("faqHeading", v)} />
            <div className="space-y-2">
              {brief.copy.faq.map((f, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-400">Q{i + 1}</p>
                    <button onClick={() => removeFaq(i)} className="text-[10px] text-red-400 hover:text-red-600">削除</button>
                  </div>
                  <Field label="質問" value={f.q} onChange={v => setFaq(i, "q", v)} />
                  <Field label="回答" value={f.a} onChange={v => setFaq(i, "a", v)} multiline />
                </div>
              ))}
            </div>
            <button onClick={addFaq} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 hover:border-[#2F73D9] hover:text-[#2F73D9] transition-colors">
              + Q&A を追加
            </button>
          </Section>

          <Section title="CTA">
            <Field label="見出し" value={brief.copy.ctaHeadline} onChange={v => setCopy("ctaHeadline", v)} />
            <Field label="説明文" value={brief.copy.ctaDesc} onChange={v => setCopy("ctaDesc", v)} multiline />
            <div className="grid grid-cols-2 gap-3">
              <Field label="メインボタン" value={brief.copy.ctaPrimary} onChange={v => setCopy("ctaPrimary", v)} />
              <Field label="サブボタン" value={brief.copy.ctaSecondary} onChange={v => setCopy("ctaSecondary", v)} />
            </div>
            <Field label="Formspree エンドポイント（省略可）" value={brief.copy.formspreeEndpoint} onChange={v => setCopy("formspreeEndpoint", v)} />
          </Section>
        </div>
      )}

      {/* 画像タブ */}
      {tab === "images" && (
        <div className="space-y-4">
          <ImageUpload label="ロゴ" path={brief.images.logo} file={imageFiles["logo"]} onChange={(f, p) => { onImageChange("logo", f, p); setImages("logo", p); }} description="SVG / PNG 透過推奨" />
          <ImageUpload label="Hero メイン画像" path={brief.images.hero} file={imageFiles["hero"]} onChange={(f, p) => { onImageChange("hero", f, p); setImages("hero", p); }} />
          <div className="grid grid-cols-3 gap-3">
            {(["problem1", "problem2", "problem3"] as const).map((k, i) => (
              <ImageUpload key={k} label={`課題 ${i + 1}`} path={brief.images[k]} file={imageFiles[k]} onChange={(f, p) => { onImageChange(k, f, p); setImages(k, p); }} />
            ))}
          </div>
          <ImageUpload label="Service メイン画像" path={brief.images.serviceMain} file={imageFiles["serviceMain"]} onChange={(f, p) => { onImageChange("serviceMain", f, p); setImages("serviceMain", p); }} />
          <ImageUpload label="Curriculum 画像" path={brief.images.curriculum} file={imageFiles["curriculum"]} onChange={(f, p) => { onImageChange("curriculum", f, p); setImages("curriculum", p); }} />
        </div>
      )}

      {/* カラータブ */}
      {tab === "colors" && (
        <div className="space-y-3">
          {COLOR_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="color"
                value={brief.colors[key]}
                onChange={e => setColors(key, e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 shrink-0"
              />
              <input
                type="text"
                value={brief.colors[key]}
                onChange={e => setColors(key, e.target.value)}
                className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:border-[#2F73D9]"
              />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
