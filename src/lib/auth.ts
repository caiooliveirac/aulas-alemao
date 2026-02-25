import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const COOKIE_NAME = "db_auth";

/**
 * A valid token is any 64-char hex string (SHA-256 output).
 */
function isValidToken(token: string | undefined): token is string {
  return !!token && /^[a-f0-9]{64}$/.test(token);
}

/**
 * Call at the top of any server page/component that requires authentication.
 * Redirects to /login if no valid session cookie.
 * Note: Next.js automatically prepends basePath to redirect().
 */
export async function requireAuth(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;

  if (!isValidToken(token)) {
    redirect("/login");
  }
}

/**
 * Extract the user's clientId (PIN hash) from the request cookie.
 * Returns null if not authenticated.
 */
export function getClientId(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([a-f0-9]{64})`));
  return match?.[1] ?? null;
}

/**
 * Extract clientId from server component context (cookies()).
 */
export async function getServerClientId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return isValidToken(token) ? token : null;
}
