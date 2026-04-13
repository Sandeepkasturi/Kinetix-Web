export const PLANS = {
  starter: {
    name: 'Starter',
    priceINR: 0,
    priceUSD: 0,
  },
  pro: {
    name: 'Pro',
    priceINR: 399,
    priceUSD: 19.99,
  },
  premium: {
    name: 'Premium',
    priceINR: 799,
    priceUSD: 39.99,
  },
};

export type PlanKey = keyof typeof PLANS;
