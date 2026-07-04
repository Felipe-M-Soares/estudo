#!/usr/bin/env node
// Guarda de seguranca: roda antes de dev/build e pode rodar no CI (GitHub
// Actions) para impedir que segredos (service role key do Supabase, tokens,
// senhas, etc.) acabem versionados no Git por engano.
//
// O que ele verifica:
// 1. Se o arquivo .env (que tem os segredos reais) esta rastreado pelo Git.
//    Isso e o pior cenario: mesmo com .gitignore, um `git add -f .env`
//    acidental ou um commit antigo pode ter versionado o arquivo.
// 2. Se algum arquivo rastreado pelo Git contem um padrao que parece uma
//    chave/segredo real (JWT do Supabase, "service_role", etc.) em vez de
//    um placeholder de exemplo.
//
// Uso:
//   node scripts/check-secrets.mjs
// Sai com codigo 1 (falha) se encontrar algo suspeito, imprimindo o motivo.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

function gitTrackedFiles() {
  try {
    const out = execFileSync('git', ['ls-files'], { encoding: 'utf8' });
    return out.split('\n').filter(Boolean);
  } catch {
    // Nao e um repositorio git (ex.: rodando de um zip solto) - nada para
    // checar aqui, mas isso NAO significa que esta seguro para publicar.
    console.warn('[check-secrets] Aviso: nao parece ser um repositorio git; pulando checagem de arquivos rastreados.');
    return null;
  }
}

// Padroes que indicam um segredo real (nao um placeholder de exemplo).
// JWTs (como a service_role key e a anon key do Supabase) sempre comecam
// com "eyJ" e tem 3 partes separadas por ponto.
const SECRET_PATTERNS = [
  { name: 'JWT (parece service_role/anon key do Supabase)', regex: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/ },
  { name: 'Chave de acesso Mercado Pago', regex: /APP_USR-[A-Za-z0-9-]{20,}/ },
];

// Arquivos onde e ESPERADO ver exemplos/placeholders parecidos - ignorar.
const ALLOWLIST = new Set(['.env.example', 'scripts/check-secrets.mjs', 'SECURITY_AUDIT.md', 'COMMERCIAL_DEPLOY.md', 'PRIMEIROS_PASSOS_SUPABASE.md']);

// Extensoes binarias / grandes que nao vale a pena escanear como texto.
const SKIP_EXTENSIONS = /\.(png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot|zip|lock)$/i;

let failed = false;
const trackedFiles = gitTrackedFiles();

if (trackedFiles) {
  if (trackedFiles.includes('.env')) {
    console.error('[check-secrets] FALHA: o arquivo .env esta rastreado pelo Git. Ele contem segredos reais e NUNCA deve ser commitado.');
    console.error('  Corrija com: git rm --cached .env   (depois confirme que .env esta no .gitignore e faca um novo commit)');
    console.error('  IMPORTANTE: se este .env ja foi enviado ao GitHub alguma vez, troque TODAS as chaves nele (elas devem ser consideradas vazadas).');
    failed = true;
  }

  const trackedDataFiles = trackedFiles.filter((file) => file === '.data' || file.startsWith('.data/'));
  if (trackedDataFiles.length > 0) {
    console.error(`[check-secrets] FALHA: ${trackedDataFiles.length} arquivo(s) dentro de .data/ estao rastreados pelo Git (ex.: ${trackedDataFiles[0]}).`);
    console.error('  Essa pasta guarda o secrets.json com TOKEN_SECRET/ADMIN_TOKEN gerados automaticamente - nunca deve ir para o repositorio.');
    console.error('  Corrija com: git rm -r --cached .data   (e gere novos TOKEN_SECRET/ADMIN_TOKEN se ja foram versionados)');
    failed = true;
  }

  for (const file of trackedFiles) {
    if (ALLOWLIST.has(file) || SKIP_EXTENSIONS.test(file)) continue;
    let content;
    try {
      content = readFileSync(file, 'utf8');
    } catch {
      continue; // arquivo binario ou ilegivel como texto - pula
    }
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(content)) {
        console.error(`[check-secrets] FALHA: ${file} parece conter um segredo real (${pattern.name}).`);
        console.error('  Remova o valor, use uma variavel de ambiente, e troque essa chave se ja foi versionada.');
        failed = true;
      }
    }
  }
}

if (failed) {
  console.error('\n[check-secrets] Encontrou problema(s) acima. Corrija antes de continuar.');
  process.exit(1);
}

console.log('[check-secrets] OK: nenhum segredo aparente encontrado nos arquivos rastreados pelo Git.');
