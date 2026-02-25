import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

const COOKIE_NAME = "db_auth";
const MAX_AGE = 365 * 24 * 60 * 60; // 1 year

function hashPin(pin: string): string {
  return createHash("sha256").update(`deutschbruecke:${pin}`).digest("hex");
}

/**
 * POST — hash the PIN, set it as cookie.
 * Any PIN is valid. The hash becomes the user's identity (progress file ID).
 * Same PIN on any device = same progress.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const pin = (body as { pin?: string })?.pin?.trim();
  if (!pin || pin.length < 4) {
    return NextResponse.json({ error: "PIN_TOO_SHORT", message: "PIN deve ter pelo menos 4 caracteres." }, { status: 400 });
  }

  const token = hashPin(pin);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: process.env.NEXT_PUBLIC_BASE_PATH || "/",
    maxAge: MAX_AGE,
  });

  return NextResponse.json({ ok: true });
}

/** DELETE — clear auth cookie (logout) */
export async function DELETE() {
  const jar = await cookies();
  jar.delete({
    name: COOKIE_NAME,
    path: process.env.NEXT_PUBLIC_BASE_PATH || "/",
  });
  return NextResponse.json({ ok: true });
}
