import { NextResponse } from "next/server";
import { readProgress, writeProgress } from "@/server/progressStore";
import { defaultProgressState, type ProgressState } from "@/lib/progress";
import { isAuthenticated } from "@/lib/auth";

function clientIdFrom(req: Request) {
  return req.headers.get("x-client-id") || "default";
}

export async function GET(req: Request) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const clientId = clientIdFrom(req);
  const state = await readProgress(clientId);
  return NextResponse.json({ state }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const clientId = clientIdFrom(req);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const state = (body as { state?: ProgressState })?.state;
  if (!state) {
    return NextResponse.json({ error: "MISSING_STATE" }, { status: 400 });
  }

  // v1: keep it lenient (backend is optional). Avoid throwing on older clients.
  const merged: ProgressState = { ...defaultProgressState, ...state };
  await writeProgress(clientId, merged);
  return NextResponse.json({ ok: true });
}
