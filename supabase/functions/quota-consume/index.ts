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
    .select('plan,status')
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
    const payload = await req.json().catch(() => ({}));
    const wordsRaw = payload?.words;
    const words = Number.isFinite(wordsRaw) ? Math.floor(wordsRaw) : Number.parseInt(String(wordsRaw || '0'), 10);
    if (!Number.isFinite(words) || words <= 0) {
      return new Response(JSON.stringify({ error: 'Missing words' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    const { data: current, error: currentError } = await serviceClient
      .from('quota_weekly_usage')
      .select('words_used')
      .eq('user_id', user.id)
      .eq('period_start', periodStart)
      .maybeSingle();
    if (currentError) {
      throw currentError;
    }
    const usedBefore = current?.words_used || 0;
    if (usedBefore >= WEEKLY_QUOTA_WORDS) {
      return new Response(JSON.stringify({ error: 'quota_reached' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: nextUsed, error: consumeError } = await serviceClient.rpc('_quota_weekly_consume', {
      p_user_id: user.id,
      p_period_start: periodStart,
      p_words: words,
      p_limit: WEEKLY_QUOTA_WORDS,
    });
    if (consumeError) {
      throw consumeError;
    }

    const used = Number.isFinite(nextUsed) ? Number(nextUsed) : (typeof nextUsed === 'string' ? Number.parseInt(nextUsed, 10) : 0);

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
    return new Response(JSON.stringify({ error: error?.message || 'Quota consume error' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
