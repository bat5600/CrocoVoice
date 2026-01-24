import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient } from '../_shared/supabase.ts';
import { stripe } from '../_shared/stripe.ts';
import { requireEnv } from '../_shared/env.ts';
import { requireAuthenticatedUser } from '../_shared/auth.ts';

const STRIPE_RETURN_URL = Deno.env.get('STRIPE_RETURN_URL') || requireEnv('STRIPE_SUCCESS_URL');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user } = await requireAuthenticatedUser(req);
    const serviceClient = createServiceClient();

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
    const status = error?.status || 500;
    return new Response(JSON.stringify({ error: error?.message || 'Portal error' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
