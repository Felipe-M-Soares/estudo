import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "node:crypto";
import { PreApproval } from "mercadopago";
import { mpClient } from "./_lib/mercadopago";
import { supabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";
import { resolvePlanPricing } from "./_lib/plans";

// Cria uma assinatura recorrente (cobrança automática todo mês) via
// Mercado Pago PreApproval. Diferente de /api/create-preference (pagamento
// único, usado pelo plano Vitalício), aqui o usuário autoriza uma vez e o
// cartão é cobrado de novo sozinho a cada 30 dias, sem precisar pagar
// manualmente de novo.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const user = await getUserFromAuthHeader(req.headers.authorization);
  if (!user) {
    res.status(401).json({ error: "Não autenticado. Faça login novamente." });
    return;
  }

  const { planId } = (req.body ?? {}) as { planId?: string };
  const pricing = planId ? resolvePlanPricing(planId, "BRL") : null;
  if (!pricing || !pricing.recurring) {
    res.status(400).json({ error: "Este plano não usa cobrança recorrente. Use /api/create-preference para o Vitalício." });
    return;
  }

  const externalReference = `${user.id}:${pricing.id}:${randomUUID()}`;
  const siteUrl = process.env.PUBLIC_SITE_URL || `https://${req.headers.host}`;

  // Mesma lógica de segurança do checkout único: cria a linha "pending"
  // ANTES de chamar a Mercado Pago. O webhook (subscription_preapproval)
  // só atualiza o status depois que o próprio Mercado Pago confirmar.
  const { error: insertError } = await supabaseAdmin.from("subscriptions").insert({
    user_id: user.id,
    plan_id: pricing.id,
    status: "pending",
    currency: pricing.currency,
    amount: pricing.amount,
    external_reference: externalReference,
  });

  if (insertError) {
    res.status(500).json({ error: "Não foi possível iniciar a assinatura. Tente novamente." });
    return;
  }

  try {
    const preApprovalClient = new PreApproval(mpClient);
    const subscription = await preApprovalClient.create({
      body: {
        reason: pricing.title,
        external_reference: externalReference,
        payer_email: user.email ?? undefined,
        back_url: `${siteUrl}/?checkout=success`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: pricing.amount,
          currency_id: "BRL",
        },
      },
    });

    // Guarda o id da assinatura no Mercado Pago pra casar com os webhooks
    // de cobrança recorrente (subscription_authorized_payment) depois.
    if (subscription.id) {
      await supabaseAdmin
        .from("subscriptions")
        .update({ mp_preapproval_id: subscription.id })
        .eq("external_reference", externalReference);
    }

    res.status(200).json({
      initPoint: subscription.init_point,
      externalReference,
    });
  } catch (err) {
    console.error("[Code Mage/api] Erro ao criar assinatura Mercado Pago:", err);
    res.status(502).json({ error: "Mercado Pago recusou a criação da assinatura. Verifique as credenciais (MP_ACCESS_TOKEN)." });
  }
}
