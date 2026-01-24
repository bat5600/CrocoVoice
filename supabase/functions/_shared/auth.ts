import { createUserClient } from './supabase.ts';

function extractToken(authHeader: string | null, bodyToken?: string) {
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return authHeader || bodyToken || null;
}

export async function requireAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  let payload: Record<string, unknown> | null = null;
  if (!authHeader) {
    payload = await req.clone().json().catch(() => ({}));
  }
  const token = extractToken(authHeader, payload?.token as string | undefined);
  if (!token) {
    const error = new Error('Unauthorized');
    // @ts-expect-error custom status
    error.status = 401;
    throw error;
  }

  const userClient = createUserClient(`Bearer ${token}`);
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData?.user) {
    const error = new Error('Unauthorized');
    // @ts-expect-error custom status
    error.status = 401;
    throw error;
  }

  return { user: userData.user, token };
}
