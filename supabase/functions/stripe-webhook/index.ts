import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient } from '../_shared/supabase.ts';
import { stripe } from '../_shared/stripe.ts';
import { requireEnv } from '../_shared/env.ts';
import type Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const STRIPE_WEBHOOK_SECRET = requireEnv('STRIPE_WEBHOOK_SECRET');
const STRIPE_PRICE_ID = requireEnv('STRIPE_PRICE_ID');

async function getUserIdForCustomer(serviceClient: ReturnType<typeof createServiceClient>, customerId: string) {
  const { data: existing } = await serviceClient
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  if (existing?.user_id) {
    return existing.user_id;
  }
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer && !Array.isArray(customer)) {
      const metadata = customer.metadata || {};
      return metadata.supabase_user_id || null;
    }
  } catch (error) {
    console.error('stripe-webhook customer lookup failed', error);
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  const payload = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('stripe-webhook signature error', error);
    return new Response('Invalid signature', { status: 400 });
  }

  const serviceClient = createServiceClient();
  const { data: existingEvent } = await serviceClient
    .from('stripe_events')
    .select('id')
    .eq('id', event.id)
    .maybeSingle();

  if (existingEvent?.id) {
    return new Response('ok', { status: 200 });
  }

  const { error: insertError } = await serviceClient.from('stripe_events').insert({
    id: event.id,
    created_at: new Date(event.created * 1000).toISOString(),
  });
  if (insertError) {
    console.warn('stripe-webhook event insert failed', insertError);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer ? String(session.customer) : null;
      const userId = session.client_reference_id || null;
      if (customerId && userId) {
        await serviceClient.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          status: 'pending',
          plan: 'pro',
          updated_at: new Date().toISOString(),
        });
      }
    }

    if (
      event.type === 'customer.subscription.created'
      || event.type === 'customer.subscription.updated'
      || event.type === 'customer.subscription.deleted'
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer ? String(subscription.customer) : '';
      const userId = await getUserIdForCustomer(serviceClient, customerId);
      if (!userId) {
        console.warn('stripe-webhook: missing user_id for customer', customerId);
        return new Response('ok', { status: 200 });
      }

      const priceId = subscription.items.data[0]?.price?.id || null;
      const plan = priceId === STRIPE_PRICE_ID ? 'pro' : 'unknown';
      const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;

      await serviceClient.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        status: subscription.status,
        plan,
        price_id: priceId,
        current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('stripe-webhook handler error', error);
    return new Response('Webhook error', { status: 500 });
  }

  return new Response('ok', { status: 200, headers: corsHeaders });
});
