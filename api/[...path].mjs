// Funcao serverless da Vercel. Qualquer requisicao para /api/* cai aqui
// automaticamente (convencao de arquivo "catch-all" da Vercel: o nome
// [...path].mjs dentro da pasta api/ significa "qualquer coisa depois de
// /api/"). Toda a logica de negocio real mora em server/app.mjs, que e a
// MESMA usada pelo servidor tradicional em server/server.mjs - nada de
// regra de negocio duplicada entre os dois jeitos de hospedar.
import { handleApi, seedDb, sendError, withCors } from '../server/app.mjs';

// Evita rodar a semeadura da licenca de demonstracao em toda invocacao fria;
// o proprio seedDb ja e idempotente (confere se a licenca existe antes de
// criar), mas guardamos numa promise unica por instancia para nao repetir
// a consulta ao Supabase sem necessidade.
let seeded = null;

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  try {
    if (!seeded) seeded = seedDb();
    await seeded;

    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    await handleApi(req, res, url.pathname);
  } catch (error) {
    if (error?.message === 'payload_too_large') return sendError(res, 413, 'Payload grande demais.', 'payload_too_large');
    if (error?.message === 'invalid_json') return sendError(res, 400, 'JSON invalido.', 'invalid_json');
    console.error(error);
    sendError(res, 500, 'Erro interno.', 'internal_error');
  }
}
