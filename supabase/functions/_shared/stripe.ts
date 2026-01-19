import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { requireEnv } from './env.ts';

const STRIPE_SECRET_KEY = requireEnv('STRIPE_SECRET_KEY');

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  httpClient: Stripe.createFetchHttpClient(),
});
