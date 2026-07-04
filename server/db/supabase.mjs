import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sao obrigatorios. Copie .env.example para .env, ' +
      'crie um projeto em https://supabase.com, rode supabase/schema.sql no SQL Editor e cole ' +
      'a URL e a "service_role key" do seu projeto (Project Settings > API).',
  );
}

// IMPORTANTE: a service role key ignora RLS e tem acesso total ao banco.
// Ela deve existir SOMENTE aqui, no backend (server/*), e nunca ser enviada
// ao navegador, incluida em builds do frontend ou logada. O frontend nunca
// fala com o Supabase diretamente - sempre passa pela API do DevQuest.
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: 'public' },
});
