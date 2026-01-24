import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient } from '../_shared/supabase.ts';
import { stripe } from '../_shared/stripe.ts';
import { requireEnv } from '../_shared/env.ts';
import { requireAuthenticatedUser } from '../_shared/auth.ts';

const STRIPE_PRICE_ID = requireEnv('STRIPE_PRICE_ID');
const STRIPE_RETURN_URL = Deno.env.get('STRIPE_RETURN_URL') || '';
const STRIPE_SUCCESS_URL = Deno.env.get('STRIPE_SUCCESS_URL') || STRIPE_RETURN_URL;
const STRIPE_CANCEL_URL = Deno.env.get('STRIPE_CANCEL_URL') || STRIPE_RETURN_URL;

function buildRedirectUrl(baseUrl: string, sessionIdPlaceholder: string) {
  if (!baseUrl) {
    throw new Error('Missing Stripe return URL configuration.');
  }
  if (baseUrl.includes('{CHECKOUT_SESSION_ID}')) {
    return baseUrl;
  }
  const url = new URL(baseUrl);
  if (!url.searchParams.get('session_id')) {
    url.searchParams.set('session_id', sessionIdPlaceholder);
  }
  return url.toString();
}

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

    let stripeCustomerId = existing?.stripe_customer_id || null;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          supabase_user_id: user.id,
          supabase_email: user.email || '',
        },
      });
      stripeCustomerId = customer.id;
      await serviceClient.from('subscriptions').upsert({
        user_id: user.id,
        stripe_customer_id: stripeCustomerId,
        status: 'inactive',
        plan: 'free',
        updated_at: new Date().toISOString(),
      });
    }

    const successUrl = buildRedirectUrl(STRIPE_SUCCESS_URL, '{CHECKOUT_SESSION_ID}');
    const cancelUrl = buildRedirectUrl(STRIPE_CANCEL_URL || STRIPE_SUCCESS_URL, '{CHECKOUT_SESSION_ID}');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      client_reference_id: user.id,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('stripe-checkout error', error);
    const status = error?.status || 500;
    return new Response(JSON.stringify({ error: error?.message || 'Checkout error' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
