import { requireEnv } from './env.ts';
import { createServiceClient } from './supabase.ts';

const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_AUTH_ISSUER = `${SUPABASE_URL}/auth/v1`;

type JwtPayload = {
  sub?: string;
  iss?: string;
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function extractToken(authHeader: string | null, bodyToken?: string) {
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return authHeader || bodyToken || null;
}

export async function requireAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const payload = await req.clone().json().catch(() => ({}));
  const token = extractToken(authHeader, payload?.token);
  const jwtPayload = token ? decodeJwtPayload(token) : null;
  const tokenExpired = jwtPayload?.exp ? Date.now() >= jwtPayload.exp * 1000 : true;
  const issuerOk = jwtPayload?.iss === SUPABASE_AUTH_ISSUER;

  if (!token || !jwtPayload?.sub || !issuerOk || tokenExpired) {
    const error = new Error('Unauthorized');
    // @ts-expect-error custom status
    error.status = 401;
    throw error;
  }

  const serviceClient = createServiceClient();
  const { data: userData, error: userError } = await serviceClient.auth.admin.getUserById(jwtPayload.sub);
  if (userError || !userData?.user) {
    const error = new Error('Unauthorized');
    // @ts-expect-error custom status
    error.status = 401;
    throw error;
  }

  return { user: userData.user, token };
}

