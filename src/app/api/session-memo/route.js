import { NextResponse } from "next/server";
import { getSessionMemo, setSessionMemo } from "@/lib/ratingsStore";
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
  const memo = await getSessionMemo(sessionId);

  return NextResponse.json({ memo });
}

export async function POST(request) {
  if (!(await isParentsRequest())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
  const memo = typeof body?.memo === "string" ? body.memo : "";

  if (!sessionId) {
    return NextResponse.json({ error: "invalid_session" }, { status: 400 });
  }

  const result = await setSessionMemo(sessionId, memo);
  if (!result.ok) {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
