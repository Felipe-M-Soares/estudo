import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Payment, PreApproval } from "mercadopago";
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { mpClient } from "./_lib/mercadopago";
import { supabaseAdmin } from "./_lib/supabaseAdmin";

function firstValue(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

// Pagamento único (Preference) hoje só é usado pelo plano Vitalício —
// starter/pro passaram a usar cobrança recorrente (PreApproval), tratada
// mais abaixo. Mantido genérico (30 dias) como fallback caso algum dia
// volte a existir um checkout avulso para plano mensal.
function oneTimePlanDurationDays(planId: string): number | null {
  if (planId === "lifetime") return null; // nunca expira
  return 30;
}

function verifySignature(req: VercelRequest, dataId: string): { ok: boolean; reason?: string } {
  const webhookSecret = process.env.MP_WEBHOOK_SECRET;
  if (!webhookSecret) return { ok: true };
  try {
    WebhookSignatureValidator.validate({
      xSignature: req.headers["x-signature"] as string | undefined,
      xRequestId: req.headers["x-request-id"] as string | undefined,
      dataId,
      secret: webhookSecret,
      toleranceSeconds: 300,
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof InvalidWebhookSignatureError) {
      return { ok: false, reason: err.reason };
    }
    throw err;
  }
}

// ----------------------------------------------------------------------------
// type=payment: pagamento único (usado hoje pelo plano Vitalício).
// ----------------------------------------------------------------------------
async function handleOneTimePayment(dataId: string, res: VercelResponse) {
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
    const days = oneTimePlanDurationDays(planId);
    activeUntil = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : null;
  }

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({ status, mp_payment_id: String(payment.id), active_until: activeUntil })
    .eq("external_reference", externalReference);

  if (error) {
    console.error("[Code Mage/webhook] Erro ao atualizar assinatura (payment):", error.message);
    res.status(500).json({ error: "Erro ao atualizar assinatura" });
    return;
  }

  res.status(200).json({ received: true });
}

// ----------------------------------------------------------------------------
// type=subscription_preapproval: o usuário autorizou (ou cancelou/pausou) a
// cobrança recorrente. Só atualiza o STATUS aqui — quem estende o acesso
// (active_until) é o evento de cada cobrança (subscription_authorized_payment),
// pra não conceder 30 dias de acesso antes do cartão ser cobrado de verdade.
// ----------------------------------------------------------------------------
async function handleSubscriptionPreapproval(dataId: string, res: VercelResponse) {
  const preApprovalClient = new PreApproval(mpClient);
  const subscription = await preApprovalClient.get({ id: dataId });

  const externalReference = subscription.external_reference;
  if (!externalReference) {
    res.status(200).json({ received: true, ignored: true, reason: "sem external_reference" });
    return;
  }

  const statusMap: Record<string, string> = {
    authorized: "approved",
    pending: "pending",
    paused: "cancelled",
    cancelled: "cancelled",
  };
  const status = statusMap[subscription.status ?? "pending"] ?? "pending";

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({ status, mp_preapproval_id: dataId })
    .eq("external_reference", externalReference);

  if (error) {
    console.error("[Code Mage/webhook] Erro ao atualizar assinatura (preapproval):", error.message);
    res.status(500).json({ error: "Erro ao atualizar assinatura" });
    return;
  }

  res.status(200).json({ received: true });
}

// ----------------------------------------------------------------------------
// type=subscription_authorized_payment: uma cobrança recorrente foi
// processada (mensalidade do Starter/Pro). O SDK do Node não tem um cliente
// dedicado pra esse recurso ainda, então chamamos a API REST direto.
// ----------------------------------------------------------------------------
async function handleAuthorizedPayment(dataId: string, res: VercelResponse) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  const response = await fetch(`https://api.mercadopago.com/authorized_payments/${dataId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error("[Code Mage/webhook] Erro ao buscar authorized_payment:", response.status, await response.text());
    res.status(502).json({ error: "Erro ao consultar cobrança recorrente" });
    return;
  }

  const data = (await response.json()) as {
    preapproval_id?: string;
    status?: string; // "processed" | "pending" | "rejected" | "cancelled" | "recycled"
    payment?: { status?: string };
  };

  const preapprovalId = data.preapproval_id;
  if (!preapprovalId) {
    res.status(200).json({ received: true, ignored: true, reason: "sem preapproval_id" });
    return;
  }

  const charged = data.status === "processed" || data.payment?.status === "approved";
  if (!charged) {
    // Cobrança pendente/recusada: não estende o acesso, mas confirma o
    // recebimento pra Mercado Pago não reenviar em loop.
    res.status(200).json({ received: true, ignored: true, reason: `cobrança não confirmada (status=${data.status})` });
    return;
  }

  // Estende a partir do que for maior entre "agora" e o active_until atual,
  // pra não perder dias caso o webhook chegue um pouco atrasado nem
  // empilhar dias demais se chegar adiantado.
  const { data: row, error: findError } = await supabaseAdmin
    .from("subscriptions")
    .select("id, active_until")
    .eq("mp_preapproval_id", preapprovalId)
    .maybeSingle();

  if (findError || !row) {
    res.status(200).json({ received: true, ignored: true, reason: "assinatura não encontrada para este preapproval_id" });
    return;
  }

  const base = row.active_until && new Date(row.active_until).getTime() > Date.now() ? new Date(row.active_until) : new Date();
  const activeUntil = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({ status: "approved", active_until: activeUntil })
    .eq("id", row.id);

  if (error) {
    console.error("[Code Mage/webhook] Erro ao estender assinatura (authorized_payment):", error.message);
    res.status(500).json({ error: "Erro ao estender assinatura" });
    return;
  }

  res.status(200).json({ received: true });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Mercado Pago espera 200 rápido. Qualquer verificação que falhar retorna
  // 4xx/5xx só para casos de fraude/erro real — nunca deixamos a rota cair
  // silenciosamente sem responder.
  try {
    const type = firstValue(req.query.type as string | string[] | undefined) ?? firstValue(req.query.topic as string | string[] | undefined);
    const dataId = firstValue(req.query["data.id"] as string | string[] | undefined) ?? firstValue(req.query.id as string | string[] | undefined);

    const knownTypes = ["payment", "subscription_preapproval", "subscription_authorized_payment"];
    if (!type || !knownTypes.includes(type) || !dataId) {
      // Outros tipos de evento (merchant_order, etc.) — reconhece e ignora.
      res.status(200).json({ received: true, ignored: true });
      return;
    }

    const signature = verifySignature(req, dataId);
    if (!signature.ok) {
      console.error("[Code Mage/webhook] Assinatura inválida:", signature.reason);
      res.status(401).json({ error: "Assinatura inválida" });
      return;
    }

    if (type === "payment") return await handleOneTimePayment(dataId, res);
    if (type === "subscription_preapproval") return await handleSubscriptionPreapproval(dataId, res);
    return await handleAuthorizedPayment(dataId, res);
  } catch (err) {
    console.error("[Code Mage/webhook] Erro inesperado:", err);
    res.status(500).json({ error: "Erro inesperado no webhook" });
  }
}
