import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const BRIEF_PATH = path.join(process.cwd(), "src/config/design-brief.json");

export async function GET() {
  if (!fs.existsSync(BRIEF_PATH)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const data = JSON.parse(fs.readFileSync(BRIEF_PATH, "utf-8"));
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const brief = await req.json();
  brief.meta.updatedAt = new Date().toISOString();

  fs.mkdirSync(path.dirname(BRIEF_PATH), { recursive: true });
  fs.writeFileSync(BRIEF_PATH, JSON.stringify(brief, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
