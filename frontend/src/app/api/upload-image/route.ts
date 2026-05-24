import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const publicDir = path.join(process.cwd(), "public/images");
  fs.mkdirSync(publicDir, { recursive: true });

  const saved: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (!(value instanceof File)) continue;
    const buffer = Buffer.from(await value.arrayBuffer());
    const filename = value.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    fs.writeFileSync(path.join(publicDir, filename), buffer);
    saved[key] = `/images/${filename}`;
  }

  return NextResponse.json(saved);
}
