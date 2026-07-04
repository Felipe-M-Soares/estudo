// v2: a versao anterior tinha um bug serio - o comentario dizia
// "network-first para navegacao", mas o codigo na verdade fazia
// cache-first para tudo (checava o cache antes da rede). Como os arquivos
// JS/CSS do build tem hash no nome (ex.: index-Da3IZpIB.js) e mudam a cada
// deploy, isso prendia o navegador de quem ja visitou o site numa versao
// antiga do index.html para sempre - apontando pra arquivos JS que nao
// existem mais no servidor, causando tela branca apos qualquer atualizacao.
const CACHE_NAME = 'devjourney-v2';
const APP_SHELL = ['/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Nunca cachear chamadas da nossa API (login, progresso, planos etc.) -
  // isso sempre precisa ser dado fresco do servidor.
  if (url.pathname.startsWith('/api/')) return;
  // So lida com o mesmo dominio; deixa terceiros passarem direto.
  if (url.origin !== self.location.origin) return;

  // Navegacao (a pagina HTML em si) e QUALQUER coisa fora de /assets/:
  // NETWORK-FIRST de verdade. Tenta a rede primeiro (pega sempre a versao
  // mais nova do index.html, com os nomes de arquivo corretos do ultimo
  // deploy); so usa o cache como fallback se estiver offline.
  const isHashedAsset = url.pathname.startsWith('/assets/');
  if (!isHashedAsset) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached ?? caches.match('/')))
    );
    return;
  }

  // Assets com hash no nome (/assets/*.js, *.css etc.): esses SIM podem ser
  // cache-first com seguranca, porque um hash especifico sempre representa
  // o mesmo conteudo - nunca fica desatualizado.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
