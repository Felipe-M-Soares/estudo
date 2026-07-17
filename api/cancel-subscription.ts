import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PreApproval } from "mercadopago";
import { mpClient } from "./_lib/mercadopago";
import { supabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";

// Cancela a renovação automática do próprio usuário. Importante ter isso
// como self-service: sem um jeito de cancelar pelo próprio app, o único
// caminho seria abrir chamado de suporte (ou pior, contestar no cartão) —
// ruim pra experiência e pra taxa de chargeback.
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

  // Busca a assinatura recorrente aprovada mais recente do usuário — nunca
  // confia em um mp_preapproval_id vindo do corpo da requisição, pra
  // ninguém conseguir cancelar a assinatura de outra pessoa.
  const { data: row, error: findError } = await supabaseAdmin
    .from("subscriptions")
    .select("id, mp_preapproval_id, status")
    .eq("user_id", user.id)
    .not("mp_preapproval_id", "is", null)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError || !row?.mp_preapproval_id) {
    res.status(404).json({ error: "Nenhuma assinatura recorrente ativa encontrada." });
    return;
  }

  try {
    const preApprovalClient = new PreApproval(mpClient);
    await preApprovalClient.update({ id: row.mp_preapproval_id, body: { status: "cancelled" } });

    // O webhook subscription_preapproval também vai confirmar isso, mas
    // atualizamos aqui na hora pra resposta imediata na tela.
    await supabaseAdmin.from("subscriptions").update({ status: "cancelled" }).eq("id", row.id);

    res.status(200).json({ cancelled: true });
  } catch (err) {
    console.error("[Code Mage/api] Erro ao cancelar assinatura Mercado Pago:", err);
    res.status(502).json({ error: "Não foi possível cancelar agora. Tente novamente em instantes." });
  }
}
