import { NextResponse } from "next/server";
import { readProgress, writeProgress } from "@/server/progressStore";
import { defaultProgressState, type ProgressState } from "@/lib/progress";
import { getClientId } from "@/lib/auth";

export async function GET(req: Request) {
  const clientId = getClientId(req);
  if (!clientId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const state = await readProgress(clientId);
  return NextResponse.json({ state }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const clientId = getClientId(req);
  if (!clientId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
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

  const merged: ProgressState = { ...defaultProgressState, ...state };
  await writeProgress(clientId, merged);
  return NextResponse.json({ ok: true });
}
