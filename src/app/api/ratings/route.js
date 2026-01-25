import { NextResponse } from "next/server";
import works from "@/content/works.json";
import { checkRateLimit, incrementRating, registerDailyDeviceRating } from "@/lib/ratingsStore";

const validChoices = new Set(["fun", "ok", "hard"]);
const validSlugs = new Set(
  works
    .map((work) => (typeof work.slug === "string" ? work.slug.trim() : ""))
    .filter((slug) => slug.length > 0)
);

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const choice = typeof body?.choice === "string" ? body.choice.trim() : "";
  const deviceId = typeof body?.deviceId === "string" ? body.deviceId.trim() : "";

  if (!slug || !validSlugs.has(slug)) {
    return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
  }

  if (!validChoices.has(choice)) {
    return NextResponse.json({ error: "invalid_choice" }, { status: 400 });
  }

  if (!deviceId) {
    return NextResponse.json({ error: "invalid_device" }, { status: 400 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

  const allowed = await checkRateLimit(ip, slug, 30);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const deviceCheck = await registerDailyDeviceRating(slug, deviceId);
  if (deviceCheck.alreadyRated) {
    return NextResponse.json({ ok: true, alreadyRated: true });
  }

  await incrementRating(slug, choice);

  return NextResponse.json({ ok: true });
}
