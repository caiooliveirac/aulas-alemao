import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

const COOKIE_NAME = "db_auth";
const MAX_AGE = 365 * 24 * 60 * 60; // 1 year

function expectedToken(): string {
  const pin = process.env.AUTH_PIN || "changeme";
  return createHash("sha256").update(`deutschbruecke:${pin}`).digest("hex");
}

/** POST — validate PIN, set auth cookie */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const pin = (body as { pin?: string })?.pin;
  if (!pin) {
    return NextResponse.json({ error: "MISSING_PIN" }, { status: 400 });
  }

  if (pin !== (process.env.AUTH_PIN || "changeme")) {
    return NextResponse.json({ error: "WRONG_PIN" }, { status: 401 });
  }

  const token = expectedToken();
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
