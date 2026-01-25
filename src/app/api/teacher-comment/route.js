import { NextResponse } from "next/server";
import { getTeacherComment, setTeacherComment } from "@/lib/ratingsStore";
import { cookies } from "next/headers";

async function isParentsRequest() {
  const cookieStore = await cookies();
  const audience = cookieStore.get("gamanavi_audience")?.value;
  return audience === "parents";
}

export async function GET(request) {
  if (!(await isParentsRequest())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") ?? "default";
  const slug = searchParams.get("slug") ?? "";
  const comment = await getTeacherComment(sessionId, slug);

  return NextResponse.json({ comment });
}

export async function POST(request) {
  if (!(await isParentsRequest())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const comment = typeof body?.comment === "string" ? body.comment : "";

  if (!sessionId || !slug) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = await setTeacherComment(sessionId, slug, comment);
  if (!result.ok) {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
