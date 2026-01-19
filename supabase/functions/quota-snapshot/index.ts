import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient } from '../_shared/supabase.ts';
import { requireAuthenticatedUser } from '../_shared/auth.ts';

const WEEKLY_QUOTA_WORDS = Number(Deno.env.get('WEEKLY_QUOTA_WORDS') || '2000');

function getWeekStartUTC(date = new Date()) {
  const utcDay = date.getUTCDay();
  const offset = (utcDay + 6) % 7;
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() - offset,
    0,
    0,
    0,
    0,
  ));
}

function getNextWeekStartUTC(date = new Date()) {
  const start = getWeekStartUTC(date);
  return new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
}

async function getSubscription(serviceClient: ReturnType<typeof createServiceClient>, userId: string) {
  const { data } = await serviceClient
    .from('subscriptions')
    .select('plan,status,current_period_end,updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  return data || null;
}

function isPro(subscription: any) {
  const plan = subscription?.plan || 'free';
  const status = subscription?.status || 'inactive';
  return plan === 'pro' && (status === 'active' || status === 'trialing');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user } = await requireAuthenticatedUser(req);

    const serviceClient = createServiceClient();
    const subscription = await getSubscription(serviceClient, user.id);
    if (isPro(subscription)) {
      return new Response(JSON.stringify({
        limit: null,
        used: 0,
        remaining: null,
        resetAt: null,
        requiresAuth: false,
        unlimited: true,
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const periodStart = getWeekStartUTC().toISOString();
    const resetAt = getNextWeekStartUTC().toISOString();

    const { data: usedValue, error: snapshotError } = await serviceClient.rpc('_quota_weekly_get_or_create', {
      p_user_id: user.id,
      p_period_start: periodStart,
    });
    if (snapshotError) {
      throw snapshotError;
    }

    const used = Number.isFinite(usedValue)
      ? Number(usedValue)
      : (typeof usedValue === 'string' ? Number.parseInt(usedValue, 10) : 0);
    return new Response(JSON.stringify({
      limit: WEEKLY_QUOTA_WORDS,
      used,
      remaining: Math.max(0, WEEKLY_QUOTA_WORDS - used),
      resetAt,
      requiresAuth: false,
      unlimited: false,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    const status = error?.status || 500;
    return new Response(JSON.stringify({ error: error?.message || 'Quota snapshot error' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
