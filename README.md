
  # Code Mage — Plano de Programação

  App web gamificado de programação: trilha, aulas, história, laboratório, arcade, carreira, revisão, analytics, loja e conta/plano.

  ## Rodando localmente

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Login real, banco de dados e pagamento

  Por padrão o app roda em "modo demo" (sem persistência, sem OAuth, sem
  pagamento real). Para ativar login com e-mail/Google/GitHub, salvar
  progresso na nuvem e receber pagamentos de verdade via Mercado Pago
  (cartão, Pix e boleto), siga o passo a passo em **[SETUP.md](./SETUP.md)**.

  Se você já tinha um projeto Supabase configurado antes desta versão, volte
  no **SQL Editor** e rode `supabase/schema.sql` de novo (é idempotente) —
  ele agora também trava moedas/personagens/aulas contra edição direta pelo
  navegador e cria as funções usadas pelo bloqueio de conteúdo por plano.

