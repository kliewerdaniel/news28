import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";

export async function GET(
  request: Request,
  { params }: { params: { slug: string; version: string } }
) {
  try {
    const filePath = join("data/personas", params.slug, params.version);
    const content = await readFile(filePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/x-yaml",
      },
    });
  } catch (error) {
    return new NextResponse("Not Found", { status: 404 });
  }
}
