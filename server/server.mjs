// Servidor HTTP tradicional para quem hospeda em VPS, Railway, Render, ou
// roda localmente (`npm run dev` / `npm start`). Toda a logica de negocio
// (rotas da API, checagens de seguranca) mora em `server/app.mjs`, que e
// compartilhada com a versao serverless usada na Vercel (`api/index.mjs`, roteada via rewrite em vercel.json).
// Se voce so faz deploy pela Vercel, este arquivo nao roda em producao -
// quem atende as requisicoes la e a funcao em `api/`.
import { createServer } from 'node:http';
import { HOST, PORT, handleApi, seedDb, sendError, serveStatic, withCors } from './app.mjs';

await seedDb();

createServer(async (req, res) => {
  if (withCors(req, res)) return;
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res, url.pathname);
      return;
    }
    serveStatic(req, res, url.pathname);
  } catch (error) {
    if (error?.message === 'payload_too_large') return sendError(res, 413, 'Payload grande demais.', 'payload_too_large');
    if (error?.message === 'invalid_json') return sendError(res, 400, 'JSON invalido.', 'invalid_json');
    console.error(error);
    sendError(res, 500, 'Erro interno.', 'internal_error');
  }
}).listen(PORT, HOST, () => {
  console.log(`DevQuest server running at http://${HOST}:${PORT}`);
});
