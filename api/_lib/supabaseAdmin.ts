import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Code Mage/api] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configurados nas variáveis de ambiente do servidor."
  );
}

/**
 * Cliente Supabase com a service role key. Só deve ser importado por código
 * que roda em /api (serverless, no servidor). NUNCA importar isso em código
 * de src/ (bundle do navegador) — a service role key ignora as políticas de
 * Row Level Security e daria acesso total ao banco para quem a obtivesse.
 */
export const supabaseAdmin = createClient(url ?? "https://placeholder.supabase.co", serviceRoleKey ?? "service-role-placeholder", {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Valida o token de acesso (JWT) que o front-end envia no header
 * Authorization: Bearer <token> e devolve o usuário autenticado dono do token.
 * Isso impede que alguém finja ser outro usuário só passando um userId no body.
 */
export async function getUserFromAuthHeader(authHeader: string | undefined) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length);
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
