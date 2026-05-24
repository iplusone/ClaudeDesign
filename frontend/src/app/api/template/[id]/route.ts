import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "src/templates", `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return NextResponse.json(data);
}
