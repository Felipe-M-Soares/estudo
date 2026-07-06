import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Payment } from "mercadopago";
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { mpClient } from "./_lib/mercadopago";
import { supabaseAdmin } from "./_lib/supabaseAdmin";

function firstValue(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function planDurationDays(planId: string): number | null {
  if (planId === "lifetime") return null; // nunca expira
  return 30; // starter e pro: renovação mensal manual (sem cobrança recorrente automática nesta versão)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Mercado Pago espera 200 rápido. Qualquer verificação que falhar retorna
  // 4xx/5xx só para casos de fraude/erro real — nunca deixamos a rota cair
  // silenciosamente sem responder.
  try {
    const type = firstValue(req.query.type as string | string[] | undefined) ?? firstValue(req.query.topic as string | string[] | undefined);
    const dataId = firstValue(req.query["data.id"] as string | string[] | undefined) ?? firstValue(req.query.id as string | string[] | undefined);

    if (type !== "payment" || !dataId) {
      // Outros tipos de evento (merchant_order, etc.) — reconhece e ignora.
      res.status(200).json({ received: true, ignored: true });
      return;
    }

    const webhookSecret = process.env.MP_WEBHOOK_SECRET;
    if (webhookSecret) {
      try {
        WebhookSignatureValidator.validate({
          xSignature: req.headers["x-signature"] as string | undefined,
          xRequestId: req.headers["x-request-id"] as string | undefined,
          dataId,
          secret: webhookSecret,
          toleranceSeconds: 300,
        });
      } catch (err) {
        if (err instanceof InvalidWebhookSignatureError) {
          console.error("[Code Mage/webhook] Assinatura inválida:", err.reason);
          res.status(401).json({ error: "Assinatura inválida" });
          return;
        }
        throw err;
      }
    }

    // Nunca confiamos no corpo da notificação — buscamos o pagamento direto
    // na API da Mercado Pago usando o access token secreto do servidor.
    const paymentClient = new Payment(mpClient);
    const payment = await paymentClient.get({ id: dataId });

    const externalReference = payment.external_reference;
    if (!externalReference) {
      res.status(200).json({ received: true, ignored: true, reason: "sem external_reference" });
      return;
    }

    const [userId, planId] = externalReference.split(":");
    if (!userId || !planId) {
      res.status(200).json({ received: true, ignored: true, reason: "external_reference malformado" });
      return;
    }

    const statusMap: Record<string, string> = {
      approved: "approved",
      pending: "pending",
      in_process: "pending",
      authorized: "pending",
      rejected: "rejected",
      cancelled: "cancelled",
      refunded: "refunded",
      charged_back: "refunded",
    };
    const status = statusMap[payment.status ?? "pending"] ?? "pending";

    let activeUntil: string | null = null;
    if (status === "approved") {
      const days = planDurationDays(planId);
      activeUntil = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : null;
    }

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status,
        mp_payment_id: String(payment.id),
        active_until: activeUntil,
      })
      .eq("external_reference", externalReference);

    if (error) {
      console.error("[Code Mage/webhook] Erro ao atualizar assinatura:", error.message);
      res.status(500).json({ error: "Erro ao atualizar assinatura" });
      return;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("[Code Mage/webhook] Erro inesperado:", err);
    res.status(500).json({ error: "Erro inesperado no webhook" });
  }
}
