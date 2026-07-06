import { MercadoPagoConfig } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  // eslint-disable-next-line no-console
  console.warn("[Code Mage/api] MP_ACCESS_TOKEN não configurado nas variáveis de ambiente do servidor.");
}

export const mpClient = new MercadoPagoConfig({
  accessToken: accessToken ?? "TEST-placeholder-token",
  options: { timeout: 8000 },
});
