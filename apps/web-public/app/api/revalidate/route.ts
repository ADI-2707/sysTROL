import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATION_SECRET || "systrol-revalidate-secret-2026";

  if (!secret || secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid revalidation secret" }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get("path") || "/projects";
  const tag = request.nextUrl.searchParams.get("tag") || "projects";

  if (path) {
    revalidatePath(path);
  }
  if (tag) {
    revalidateTag(tag);
  }

  return NextResponse.json({
    revalidated: true,
    path,
    tag,
    now: Date.now(),
  });
}
