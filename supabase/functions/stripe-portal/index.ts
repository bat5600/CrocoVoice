import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient } from '../_shared/supabase.ts';
import { stripe } from '../_shared/stripe.ts';
import { requireEnv } from '../_shared/env.ts';

const STRIPE_RETURN_URL = Deno.env.get('STRIPE_RETURN_URL') || requireEnv('STRIPE_SUCCESS_URL');
const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_AUTH_ISSUER = `${SUPABASE_URL}/auth/v1`;

function decodeJwtPayload(token: string) {
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const payload = await req.json().catch(() => ({}));
    const token = extractToken(authHeader, payload?.token);
    const jwtPayload = token ? decodeJwtPayload(token) : null;
    const tokenExpired = jwtPayload?.exp ? Date.now() >= jwtPayload.exp * 1000 : true;
    const issuerOk = jwtPayload?.iss === SUPABASE_AUTH_ISSUER;
    if (!token || !jwtPayload || !jwtPayload.sub || !issuerOk || tokenExpired) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const serviceClient = createServiceClient();
    const { data: userData, error: userError } = await serviceClient.auth.admin.getUserById(jwtPayload.sub);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const user = userData.user;

    const { data: existing } = await serviceClient
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    const stripeCustomerId = existing?.stripe_customer_id;
    if (!stripeCustomerId) {
      return new Response(JSON.stringify({ error: 'No Stripe customer found.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: STRIPE_RETURN_URL,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('stripe-portal error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Portal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
