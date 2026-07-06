import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "node:crypto";
import { Preference } from "mercadopago";
import { mpClient } from "./_lib/mercadopago";
import { supabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";
import { resolvePlanPricing } from "./_lib/plans";

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

  const { planId, currency } = (req.body ?? {}) as { planId?: string; currency?: string };
  const pricing = planId ? resolvePlanPricing(planId, currency ?? "BRL") : null;
  if (!pricing) {
    res.status(400).json({ error: "Plano inválido." });
    return;
  }

  const externalReference = `${user.id}:${pricing.id}:${randomUUID()}`;
  const siteUrl = process.env.PUBLIC_SITE_URL || `https://${req.headers.host}`;

  // Cria a linha "pending" ANTES de redirecionar. O webhook depois só
  // atualiza o status — nunca cria uma assinatura aprovada do zero, o que
  // impediria alguém de forjar uma notificação para liberar acesso de graça.
  const { error: insertError } = await supabaseAdmin.from("subscriptions").insert({
    user_id: user.id,
    plan_id: pricing.id,
    status: "pending",
    currency: pricing.currency,
    amount: pricing.amount,
    external_reference: externalReference,
  });

  if (insertError) {
    res.status(500).json({ error: "Não foi possível iniciar o pagamento. Tente novamente." });
    return;
  }

  try {
    const preferenceClient = new Preference(mpClient);
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: pricing.id,
            title: pricing.title,
            quantity: 1,
            unit_price: pricing.amount,
            currency_id: "BRL",
          },
        ],
        payer: { email: user.email ?? undefined },
        external_reference: externalReference,
        notification_url: `${siteUrl}/api/webhook`,
        back_urls: {
          success: `${siteUrl}/?checkout=success`,
          failure: `${siteUrl}/?checkout=failure`,
          pending: `${siteUrl}/?checkout=pending`,
        },
        auto_return: "approved",
        statement_descriptor: "CODE MAGE",
      },
    });

    res.status(200).json({
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      externalReference,
    });
  } catch (err) {
    console.error("[Code Mage/api] Erro ao criar preferência Mercado Pago:", err);
    res.status(502).json({ error: "Mercado Pago recusou a criação do pagamento. Verifique as credenciais (MP_ACCESS_TOKEN)." });
  }
}
