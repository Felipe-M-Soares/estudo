export type PlanId = "starter" | "pro" | "lifetime";
export type Currency = "BRL" | "USD";

export interface PlanPricing {
  id: PlanId;
  title: string;
  amount: number;
  currency: Currency;
  recurring: boolean; // true = mensal (starter/pro), false = pagamento único (lifetime)
}

// Preços em reais (cobrança padrão via Mercado Pago, que liquida em BRL mesmo
// para cartões internacionais). O valor em dólar é só referência exibida ao
// usuário — a cobrança real acontece em BRL pela Mercado Pago.
export const PLAN_TABLE: Record<PlanId, { brl: number; usdReference: number; recurring: boolean; title: string }> = {
  starter: { brl: 49.9, usdReference: 9, recurring: true, title: "Code Mage Starter" },
  pro: { brl: 89.9, usdReference: 19, recurring: true, title: "Code Mage Pro" },
  lifetime: { brl: 497.0, usdReference: 89, recurring: false, title: "Code Mage Vitalício" },
};

export function resolvePlanPricing(planId: string, currency: string): PlanPricing | null {
  const plan = PLAN_TABLE[planId as PlanId];
  if (!plan) return null;
  const cur: Currency = currency === "USD" ? "USD" : "BRL";
  return {
    id: planId as PlanId,
    title: plan.title,
    amount: plan.brl, // Mercado Pago sempre cobra em BRL nesta integração
    currency: "BRL",
    recurring: plan.recurring,
  };
}
