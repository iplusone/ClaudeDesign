"use client";
import { useRef } from "react";

interface Props {
  label: string;
  path: string;
  file?: File;
  onChange: (file: File, path: string) => void;
  description?: string;
}

export default function ImageUpload({ label, path, file, onChange, description }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
      {description && <p className="text-[10px] text-gray-400 mb-1.5">{description}</p>}
      <div
        onClick={() => ref.current?.click()}
        className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-[#2F73D9] transition-colors group min-h-[60px]"
      >
        {preview ? (
          <>
            <img src={preview} alt="" className="h-12 w-12 object-cover rounded-lg shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-600">{file?.name}</p>
              <p className="text-[10px] text-[#2F73D9]">クリックして変更</p>
            </div>
          </>
        ) : path ? (
          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-gray-400 font-mono break-all flex-1">{path}</span>
            <span className="text-[10px] text-[#2F73D9] shrink-0">変更</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <svg viewBox="0 0 20 20" className="w-5 h-5 fill-gray-300 shrink-0">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
            </svg>
            <p className="text-xs text-gray-400">クリックして画像を選択 — PNG / JPG / WebP</p>
          </div>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) onChange(f, `/images/${f.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`);
        }}
      />
    </div>
  );
}
