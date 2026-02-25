import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "db_auth";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

async function expectedToken(): Promise<string> {
  const pin = process.env.AUTH_PIN || "changeme";
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(`deutschbruecke:${pin}`).digest("hex");
}

/**
 * Call at the top of any server page/component that requires authentication.
 * Redirects to /login if not authenticated.
 */
export async function requireAuth(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  const expected = await expectedToken();

  if (token !== expected) {
    redirect(`${basePath}/login`);
  }
}

/**
 * For API routes — returns true if authenticated, false otherwise.
 * Does NOT redirect (APIs should return 401 instead).
 */
export async function isAuthenticated(req: Request): Promise<boolean> {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match?.[1];
  const expected = await expectedToken();
  return token === expected;
}
