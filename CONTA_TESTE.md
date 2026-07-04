# Conta de teste pronta para uso

Esta entrega ja vem com o backend previamente inicializado (`.data/`) contendo
uma conta de teste com **licenca Vitalicio ja ativada**, para voce validar o
fluxo completo (login → acesso liberado → progresso salvo) sem precisar
configurar nada primeiro.

## Login

1. Rode `npm install` (uma vez) e depois `npm run dev`.
2. Acesse o endereco do Vite mostrado no terminal.
3. Na tela **Conta**, escolha "Entrar" e use:

```
E-mail: teste@devquest.app
Senha:  DevQuest2026!
```

Essa conta ja tem plano **Vitalicio** ativo (acesso a todos os 22 meses,
laboratorio, arcade, analytics e projetos).

## Chave de licenca de teste (para testar ativacao manual)

Se quiser testar o fluxo de "ativar por chave" em uma conta nova, use:

```
DEVQUEST-24114C8E-60657FDF
```

Essa chave e do tipo Vitalicio e tem 5 assentos (pode ser ativada em ate 5
contas diferentes).

## Token de administrador desta instalacao

Gerado automaticamente e salvo em `.data/secrets.json`:

```
0f36c146ebdb77489c968b00bbc00986872ef72ea79afaad8a628bf38eeaaa5c
```

Use para chamar os endpoints `/api/admin/*` (gerar novas licencas, confirmar
pagamento manual, ver resumo de vendas, resetar senha de aluno). Exemplo:

```bash
curl -X POST http://localhost:8787/api/admin/licenses \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: 0f36c146ebdb77489c968b00bbc00986872ef72ea79afaad8a628bf38eeaaa5c" \
  -d '{"plan":"pro","seats":1,"note":"Novo cliente"}'
```

## Importante antes de vender/publicar de verdade

Este `.data/` (banco + segredos) foi gerado **apenas para voce testar
localmente**. Antes de colocar em producao com clientes reais:

1. Apague a pasta `.data/` (ou aponte `DATA_DIR` para outro lugar) para
   comecar com um banco vazio.
2. Defina `TOKEN_SECRET` e `ADMIN_TOKEN` novos via variavel de ambiente (ou
   deixe o servidor gerar novos automaticamente na primeira execucao em
   producao — ele faz isso sozinho se as variaveis nao existirem).
3. Configure `MERCADO_PAGO_ACCESS_TOKEN` e `MERCADO_PAGO_WEBHOOK_SECRET`
   reais para checkout de verdade (sem isso, o checkout automatico fica
   desativado, mas voce ainda pode vender manualmente e liberar acesso com
   `/api/admin/payments/confirm` ou `/api/admin/licenses`).
4. Veja `COMMERCIAL_DEPLOY.md` e `SECURITY_AUDIT.md` para o checklist
   completo de deploy e seguranca.
