import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import * as store from './db/store.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');
// DATA_DIR agora so guarda os segredos locais do servidor (TOKEN_SECRET /
// ADMIN_TOKEN quando gerados automaticamente). Todos os DADOS DO APP -
// usuarios, licencas, pedidos, progresso e eventos - moraram no Supabase
// (Postgres), configurado em SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.
// Veja supabase/schema.sql para criar as tabelas no seu projeto.
const dataDir = resolve(process.env.DATA_DIR ?? join(rootDir, '.data'));
const secretsPath = resolve(dataDir, 'secrets.json');

const NODE_ENV = process.env.NODE_ENV ?? 'development';
// A Vercel (e outras plataformas serverless) define essa variavel
// automaticamente em toda funcao. Isso importa porque, nesses ambientes,
// nao existe disco persistente entre execucoes: cada invocacao pode rodar
// numa instancia/container diferente, entao gerar um segredo aleatorio e
// salvar em arquivo local nao funciona (cada instancia teria um valor
// diferente e os tokens de sessao de outras instancias parariam de bater).
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);

// Segredos fortes por padrao: nunca usamos um valor fixo hardcoded como
// fallback (isso permitia forjar tokens de sessao/admin em qualquer
// instalacao que nao configurasse as variaveis de ambiente).
//
// - Em servidor tradicional (VPS, Railway, Render, `npm run dev` local):
//   se TOKEN_SECRET/ADMIN_TOKEN nao estiverem definidos, geramos valores
//   aleatorios uma vez e persistimos em `.data/secrets.json` para
//   sobreviver a reinicios.
// - Em plataforma serverless (Vercel, Netlify, Lambda): NAO tentamos
//   escrever em disco (nao teria efeito confiavel). Exigimos que
//   TOKEN_SECRET e ADMIN_TOKEN sejam definidos nas variaveis de ambiente
//   do painel da plataforma, com um erro claro se faltarem.
function loadOrCreateAutoSecrets() {
  if (IS_SERVERLESS) {
    throw new Error(
      'TOKEN_SECRET e ADMIN_TOKEN sao obrigatorios em ambiente serverless (Vercel/Netlify/Lambda). ' +
        'Gere dois valores aleatorios longos (ex.: rode `openssl rand -hex 48` para o TOKEN_SECRET e ' +
        '`openssl rand -hex 32` para o ADMIN_TOKEN na sua maquina) e cadastre-os em Project Settings > ' +
        'Environment Variables no painel da Vercel. Sem disco persistente entre execucoes, nao e seguro ' +
        'gerar esses valores automaticamente aqui.',
    );
  }
  mkdirSync(dataDir, { recursive: true });
  if (existsSync(secretsPath)) {
    try {
      return JSON.parse(readFileSync(secretsPath, 'utf8'));
    } catch {
      // arquivo corrompido: recria abaixo
    }
  }
  const generated = {
    TOKEN_SECRET: randomBytes(48).toString('hex'),
    ADMIN_TOKEN: randomBytes(32).toString('hex'),
  };
  writeFileSync(secretsPath, JSON.stringify(generated, null, 2));
  return generated;
}

const autoSecrets = process.env.TOKEN_SECRET && process.env.ADMIN_TOKEN ? null : loadOrCreateAutoSecrets();

const PORT = Number(process.env.PORT ?? 8787);
const HOST = process.env.HOST ?? '0.0.0.0';
const TOKEN_SECRET = process.env.TOKEN_SECRET ?? autoSecrets.TOKEN_SECRET;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? autoSecrets.ADMIN_TOKEN;
const TOKEN_TTL_SECONDS = Number(process.env.TOKEN_TTL_SECONDS ?? 60 * 60 * 24 * 7);
const REQUIRE_LICENSE = process.env.REQUIRE_LICENSE !== 'false';
const SEED_DEMO_LICENSE = process.env.SEED_DEMO_LICENSE === 'true';
const PUBLIC_APP_URL = (process.env.PUBLIC_APP_URL ?? '').replace(/\/$/, '');
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? '';
const MERCADO_PAGO_WEBHOOK_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET ?? '';
const OWNER_SETUP_TOKEN = process.env.OWNER_SETUP_TOKEN ?? '';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (NODE_ENV === 'production' && !IS_SERVERLESS && (!process.env.TOKEN_SECRET || !process.env.ADMIN_TOKEN)) {
  console.warn(
    '[DevQuest] ATENCAO: TOKEN_SECRET/ADMIN_TOKEN nao definidos via variavel de ambiente em ' +
      'producao. Um valor aleatorio foi gerado e salvo em .data/secrets.json. Isso funciona, ' +
      'mas o recomendado em producao real e definir as variaveis explicitamente e manter esse ' +
      'arquivo fora de qualquer backup publico.',
  );
}

const jsonLimitBytes = 1024 * 1024;
const rateBuckets = new Map();

const plans = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceCents: 4990,
    currency: 'BRL',
    billing: 'monthly',
    durationDays: 30,
    seats: 1,
    maxMonth: 6,
    features: {
      pt: [
        'Fases 1.1 a 1.6: logica, web, JavaScript, Git, SQL e Node',
        'Aulas, exercicios, revisao ativa e progresso em nuvem',
        'Mapa de sequencia completo para comecar do zero',
      ],
      en: [
        'Phases 1.1 to 1.6: logic, web, JavaScript, Git, SQL and Node',
        'Lessons, exercises, active review and cloud progress',
        'Full guided roadmap for starting from zero',
      ],
      es: [
        'Fases 1.1 a 1.6: logica, web, JavaScript, Git, SQL y Node',
        'Clases, ejercicios, repaso activo y progreso en la nube',
        'Mapa guiado completo para empezar desde cero',
      ],
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceCents: 8990,
    currency: 'BRL',
    billing: 'monthly',
    durationDays: 30,
    seats: 1,
    maxMonth: 22,
    features: {
      pt: [
        'Todos os 22 meses da trilha fullstack e extras de mercado',
        'Laboratorio profissional, arcade, projetos, analytics e revisoes',
        'Atualizacoes de conteudo durante a assinatura ativa',
      ],
      en: [
        'All 22 months of the fullstack path plus market extras',
        'Professional lab, arcade, projects, analytics and reviews',
        'Content updates while the subscription is active',
      ],
      es: [
        'Los 22 meses de la ruta fullstack y extras de mercado',
        'Laboratorio profesional, arcade, proyectos, analytics y repasos',
        'Actualizaciones de contenido durante la suscripcion activa',
      ],
    },
  },
  lifetime: {
    id: 'lifetime',
    name: 'Vitalicio',
    priceCents: 49700,
    currency: 'BRL',
    billing: 'lifetime',
    durationDays: null,
    seats: 1,
    maxMonth: 22,
    features: {
      pt: [
        'Acesso vitalicio a todos os conteudos atuais',
        'Laboratorio, arcade, projetos, carreira, analytics e progresso em nuvem',
        'Melhor opcao para venda direta sem recorrencia',
      ],
      en: [
        'Lifetime access to all current content',
        'Lab, arcade, projects, career mode, analytics and cloud progress',
        'Best option for one-time sales without recurring billing',
      ],
      es: [
        'Acceso vitalicio a todo el contenido actual',
        'Laboratorio, arcade, proyectos, carrera, analytics y progreso en la nube',
        'Mejor opcion para venta directa sin recurrencia',
      ],
    },
  },
};

const planList = Object.values(plans);

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160).transform((value) => value.toLowerCase()),
  password: z.string().min(10).max(200).regex(/[A-Za-z]/).regex(/[0-9]/),
  ownerSetupToken: z.string().trim().max(200).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(10).max(200).regex(/[A-Za-z]/).regex(/[0-9]/),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(160).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(200),
});

const licenseSchema = z.object({
  licenseKey: z.string().trim().min(12).max(80).transform((value) => value.toUpperCase()),
});

const checkoutSchema = z.object({
  planId: z.enum(['starter', 'pro', 'lifetime']),
});

const progressSchema = z.object({
  progress: z.record(z.string(), z.unknown()),
});

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function nowIso() {
  return new Date().toISOString();
}

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sha256(input) {
  return createHash('sha256').update(input).digest('hex');
}

function createId(prefix) {
  return `${prefix}_${randomBytes(16).toString('hex')}`;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const actual = Buffer.from(scryptSync(password, salt, 64).toString('hex'), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function signToken(payload) {
  const fullPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };
  const encoded = base64url(JSON.stringify(fullPayload));
  const signature = createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  const expected = createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function seedDb() {
  if (!SEED_DEMO_LICENSE) return;
  await store.ensureSeedLicense({
    keyHash: sha256('DEVQUEST-DEMO-2026'),
    plan: 'lifetime',
    seats: 25,
    note: 'Seed de teste. Desative com SEED_DEMO_LICENSE=false em producao.',
  });
}

async function publicUser(user) {
  const license = user.licenseId ? await store.getLicenseById(user.licenseId) : null;
  const plan = license ? plans[license.plan] : null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt ?? null,
    license: license
      ? {
          plan: license.plan,
          planName: plan?.name ?? license.plan,
          status: license.status,
          expiresAt: license.expiresAt,
          maxMonth: plan?.maxMonth ?? 0,
          billing: plan?.billing ?? 'manual',
        }
      : null,
  };
}

function isLicenseValid(license) {
  if (!license || license.status !== 'active') return false;
  if (license.expiresAt && new Date(license.expiresAt).getTime() < Date.now()) return false;
  return true;
}

async function hasAccess(user) {
  if (!REQUIRE_LICENSE) return true;
  const license = user.licenseId ? await store.getLicenseById(user.licenseId) : null;
  return isLicenseValid(license);
}

async function requireAccess(req, res) {
  const user = await requireUser(req, res);
  if (!user) return null;
  if (!(await hasAccess(user))) {
    sendError(res, 402, 'Escolha um plano ou ative uma licenca para liberar este recurso.', 'license_required');
    return null;
  }
  return user;
}

function normalizeLang(value) {
  return ['pt', 'en', 'es'].includes(value) ? value : 'pt';
}

function planPublic(plan, lang = 'pt') {
  const selectedLang = normalizeLang(lang);
  return {
    id: plan.id,
    name: plan.name,
    priceCents: plan.priceCents,
    price: plan.priceCents / 100,
    currency: plan.currency,
    billing: plan.billing,
    durationDays: plan.durationDays,
    seats: plan.seats,
    maxMonth: plan.maxMonth,
    features: Array.isArray(plan.features) ? plan.features : plan.features[selectedLang] ?? plan.features.pt,
  };
}

function licenseExpiryForPlan(plan) {
  if (!plan.durationDays) return null;
  return new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString();
}

async function createLicenseForOrder(order, paymentMeta = {}) {
  const plan = plans[order.planId];
  if (!plan) throw new Error('invalid_plan');
  const existing = await store.getLicenseByOrderId(order.id);
  if (existing) return existing;
  const rawKey = `DEVQUEST-${randomBytes(4).toString('hex').toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`;
  const license = {
    id: createId('lic'),
    keyHash: sha256(rawKey),
    plan: plan.id,
    seats: plan.seats,
    usedBy: [order.userId],
    status: 'active',
    expiresAt: licenseExpiryForPlan(plan),
    createdAt: nowIso(),
    orderId: order.id,
    source: order.provider,
    note: `Liberada por pagamento ${order.id}`,
  };
  await store.insertLicense(license);

  const user = await store.getUserById(order.userId);
  if (user) {
    user.licenseId = license.id;
    user.updatedAt = nowIso();
    await store.updateUser(user);
  }

  order.status = 'paid';
  order.paidAt = nowIso();
  order.licenseId = license.id;
  order.updatedAt = nowIso();
  order.paymentMeta = { ...(order.paymentMeta ?? {}), ...paymentMeta };
  await store.updateOrder(order);
  await store.insertEvent('payment.approved', order.userId, { orderId: order.id, planId: plan.id });
  return { ...license, rawKey };
}

function validateParsed(schema, body, res) {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    sendError(res, 400, 'Dados invalidos. Revise os campos enviados.', 'validation_error');
    return null;
  }
  return parsed.data;
}

function setHeaders(res, status, extra = {}) {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Content-Security-Policy':
      // connect-src restrito a 'self': o app nao chama nenhuma API de IA
      // diretamente do navegador, entao nao ha motivo para liberar dominios
      // externos aqui (isso so amplia a superficie de ataque em caso de XSS).
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    ...extra,
  };
  res.writeHead(status, headers);
}

function sendJson(res, status, body) {
  setHeaders(res, status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function sendError(res, status, message, code = 'error') {
  sendJson(res, status, { ok: false, code, message });
}

function shouldAllowOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.length === 0) return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return ALLOWED_ORIGINS.includes(origin);
}

function withCors(req, res) {
  const origin = req.headers.origin;
  if (shouldAllowOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? 'unknown').split(',')[0].trim();
}

function rateLimit(req, res, keyPrefix, limit = 80, windowMs = 60_000) {
  const key = `${keyPrefix}:${clientIp(req)}`;
  const bucket = rateBuckets.get(key) ?? { count: 0, resetAt: Date.now() + windowMs };
  if (Date.now() > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = Date.now() + windowMs;
  }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  if (bucket.count > limit) {
    sendError(res, 429, 'Muitas requisicoes. Tente novamente em instantes.', 'rate_limited');
    return false;
  }
  return true;
}

function parseBody(req) {
  // Em funcoes serverless da Vercel, o corpo de requisicoes JSON ja chega
  // pronto em `req.body` antes do nosso handler rodar. No servidor Node
  // tradicional (usado localmente/VPS), `req.body` nao existe e lemos o
  // stream manualmente. Suportamos os dois formatos aqui, sem depender de
  // qual dos dois esta rodando.
  if (req.body !== undefined) {
    return new Promise((resolveBody, reject) => {
      if (req.body == null || req.body === '') return resolveBody({});
      if (typeof req.body === 'object') return resolveBody(req.body);
      if (typeof req.body === 'string') {
        try {
          return resolveBody(req.body ? JSON.parse(req.body) : {});
        } catch {
          return reject(new Error('invalid_json'));
        }
      }
      resolveBody({});
    });
  }
  return new Promise((resolveBody, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (Buffer.byteLength(raw) > jsonLimitBytes) {
        reject(new Error('payload_too_large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) return resolveBody({});
      try {
        resolveBody(JSON.parse(raw));
      } catch {
        reject(new Error('invalid_json'));
      }
    });
  });
}

function safeEqualStrings(a, b) {
  const bufA = Buffer.from(String(a ?? ''));
  const bufB = Buffer.from(String(b ?? ''));
  if (bufA.length !== bufB.length) {
    // ainda gasta um tempo comparavel para nao vazar o tamanho via timing
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function isAdminAuthorized(req) {
  const adminToken = req.headers['x-admin-token'];
  return typeof adminToken === 'string' && adminToken.length > 0 && safeEqualStrings(adminToken, ADMIN_TOKEN);
}

function getBearer(req) {
  const header = req.headers.authorization ?? '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

async function requireUser(req, res) {
  const token = getBearer(req);
  const payload = verifyToken(token);
  if (!payload?.sub) {
    sendError(res, 401, 'Sessao invalida ou expirada.', 'unauthorized');
    return null;
  }
  const user = await store.getUserById(payload.sub);
  if (!user || user.status === 'disabled') {
    sendError(res, 401, 'Usuario nao encontrado.', 'unauthorized');
    return null;
  }
  return user;
}

async function handleApi(req, res, pathname) {
  const isAuthRoute = pathname.startsWith('/api/auth');
  // Rotas de auth (login/registro) usam um limite bem mais apertado que o
  // restante da API, para dificultar brute force de senha e enumeracao de
  // e-mail. O bloqueio de conta apos tentativas falhas continua existindo
  // por cima disso.
  const rateOk = isAuthRoute ? rateLimit(req, res, 'auth', 20, 60_000) : rateLimit(req, res, 'api', 100, 60_000);
  if (!rateOk) return;

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, {
      ok: true,
      app: 'DevQuest',
      mode: REQUIRE_LICENSE ? 'licensed' : 'open',
      payments: MERCADO_PAGO_ACCESS_TOKEN ? 'mercadopago' : 'not_configured',
      storage: 'supabase',
      time: nowIso(),
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/plans') {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const lang = normalizeLang(url.searchParams.get('lang') ?? 'pt');
    sendJson(res, 200, { ok: true, plans: planList.map((plan) => planPublic(plan, lang)) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/auth/register') {
    const body = validateParsed(registerSchema, await parseBody(req), res);
    if (!body) return;
    const { name, email, password } = body;
    if (await store.getUserByEmail(email)) return sendError(res, 409, 'Email ja cadastrado.', 'email_exists');

    // O primeiro usuario vira "owner" (admin do produto). Se OWNER_SETUP_TOKEN
    // estiver configurado no ambiente, exigimos que ele seja enviado para
    // conceder o papel de owner - evita que, em producao, qualquer pessoa que
    // chegue primeiro no formulario de cadastro (ex: apos um reset de banco)
    // vire administradora da plataforma.
    const isFirstUser = (await store.countUsers()) === 0;
    let role = 'student';
    if (isFirstUser) {
      if (OWNER_SETUP_TOKEN) {
        role = body.ownerSetupToken && safeEqualStrings(body.ownerSetupToken, OWNER_SETUP_TOKEN) ? 'owner' : 'student';
      } else {
        role = 'owner';
      }
    }

    const passwordHash = hashPassword(password);
    const user = await store.insertUser({
      id: createId('usr'),
      name,
      email,
      passwordHash,
      role,
      status: 'active',
      licenseId: null,
      failedLoginCount: 0,
      lockedUntil: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    await store.insertEvent('user.registered', user.id);

    const token = signToken({ sub: user.id, role: user.role });
    sendJson(res, 201, { ok: true, token, user: await publicUser(user), access: await hasAccess(user) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/auth/login') {
    const body = validateParsed(loginSchema, await parseBody(req), res);
    if (!body) return;
    const { email, password } = body;
    const rawUser = await store.getUserByEmail(email);
    const user = rawUser && rawUser.status !== 'disabled' ? rawUser : null;
    if (user?.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
      return sendError(res, 423, 'Muitas tentativas. Aguarde alguns minutos e tente novamente.', 'account_locked');
    }
    if (!user || !verifyPassword(password, user.passwordHash.salt, user.passwordHash.hash)) {
      if (user) {
        user.failedLoginCount = Number(user.failedLoginCount ?? 0) + 1;
        if (user.failedLoginCount >= 6) user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        user.updatedAt = nowIso();
        await store.updateUser(user);
        await store.insertEvent('user.login_failed', user.id);
      }
      return sendError(res, 401, 'Email ou senha invalidos.', 'invalid_credentials');
    }
    user.failedLoginCount = 0;
    user.lockedUntil = null;
    user.lastLoginAt = nowIso();
    user.updatedAt = nowIso();
    await store.updateUser(user);
    await store.insertEvent('user.login', user.id);
    const token = signToken({ sub: user.id, role: user.role });
    sendJson(res, 200, { ok: true, token, user: await publicUser(user), access: await hasAccess(user) });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/me') {
    const user = await requireUser(req, res);
    if (!user) return;
    sendJson(res, 200, { ok: true, user: await publicUser(user), access: await hasAccess(user) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/auth/change-password') {
    const user = await requireUser(req, res);
    if (!user) return;
    const body = validateParsed(changePasswordSchema, await parseBody(req), res);
    if (!body) return;
    if (!verifyPassword(body.currentPassword, user.passwordHash.salt, user.passwordHash.hash)) {
      return sendError(res, 401, 'Senha atual incorreta.', 'invalid_credentials');
    }
    user.passwordHash = hashPassword(body.newPassword);
    user.updatedAt = nowIso();
    await store.updateUser(user);
    await store.insertEvent('user.password_changed', user.id);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/owner/claim-license') {
    // Auto-ativacao de licenca vitalicia gratuita, exclusiva para quem tem
    // o papel "owner" (o dono da plataforma - normalmente o primeiro
    // cadastro). Nao precisa de token de admin: o proprio login (Bearer
    // token) do owner e a autorizacao. Isso evita que o dono do site
    // precise gerar uma licenca manual por curl so pra testar o proprio
    // produto.
    const user = await requireUser(req, res);
    if (!user) return;
    if (user.role !== 'owner') {
      return sendError(res, 403, 'Somente o dono da plataforma pode usar essa ativacao automatica.', 'forbidden');
    }
    if (await hasAccess(user)) {
      return sendJson(res, 200, { ok: true, user: await publicUser(user), access: true, alreadyActive: true });
    }
    const rawKey = `DEVQUEST-${randomBytes(4).toString('hex').toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    const license = await store.insertLicense({
      id: createId('lic'),
      keyHash: sha256(rawKey),
      plan: 'lifetime',
      seats: 1,
      usedBy: [user.id],
      status: 'active',
      expiresAt: null,
      createdAt: nowIso(),
      orderId: null,
      source: 'owner-self-claim',
      note: 'Licenca vitalicia auto-gerada para o dono da plataforma.',
    });
    user.licenseId = license.id;
    user.updatedAt = nowIso();
    await store.updateUser(user);
    await store.insertEvent('license.owner_self_claimed', user.id, { licenseId: license.id });
    sendJson(res, 200, { ok: true, user: await publicUser(user), access: await hasAccess(user) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/license/activate') {
    const user = await requireUser(req, res);
    if (!user) return;
    const body = validateParsed(licenseSchema, await parseBody(req), res);
    if (!body) return;
    const key = body.licenseKey;
    const license = await store.getLicenseByKeyHash(sha256(key));
    if (!isLicenseValid(license)) return sendError(res, 404, 'Licenca invalida, expirada ou inativa.', 'invalid_license');
    if (!license.usedBy.includes(user.id) && license.usedBy.length >= license.seats) {
      return sendError(res, 409, 'Esta licenca atingiu o limite de assentos.', 'seat_limit');
    }
    if (!license.usedBy.includes(user.id)) license.usedBy = [...license.usedBy, user.id];
    await store.updateLicense(license);
    user.licenseId = license.id;
    user.updatedAt = nowIso();
    await store.updateUser(user);
    await store.insertEvent('license.activated', user.id, { licenseId: license.id });
    sendJson(res, 200, { ok: true, user: await publicUser(user), access: await hasAccess(user) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/checkout') {
    const user = await requireUser(req, res);
    if (!user) return;
    const body = validateParsed(checkoutSchema, await parseBody(req), res);
    if (!body) return;
    const plan = plans[body.planId];
    const order = {
      id: createId('ord'),
      userId: user.id,
      planId: plan.id,
      amountCents: plan.priceCents,
      currency: plan.currency,
      provider: 'mercadopago',
      status: 'pending',
      preferenceId: null,
      checkoutUrl: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      paymentMeta: {},
    };

    if (!MERCADO_PAGO_ACCESS_TOKEN) {
      await store.insertOrder({ ...order, status: 'configuration_required' });
      await store.insertEvent('checkout.configuration_required', user.id, { orderId: order.id, planId: plan.id });
      return sendError(res, 503, 'Configure MERCADO_PAGO_ACCESS_TOKEN no servidor para gerar checkout real.', 'payments_not_configured');
    }

    const appUrl = PUBLIC_APP_URL || `http://${req.headers.host ?? 'localhost'}`;
    const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          id: plan.id,
          title: `DevQuest ${plan.name}`,
          quantity: 1,
          currency_id: plan.currency,
          unit_price: plan.priceCents / 100,
        }],
        payer: { name: user.name, email: user.email },
        external_reference: order.id,
        notification_url: `${appUrl}/api/payments/mercadopago/webhook`,
        back_urls: {
          success: `${appUrl}/?payment=success`,
          pending: `${appUrl}/?payment=pending`,
          failure: `${appUrl}/?payment=failure`,
        },
        auto_return: 'approved',
        metadata: { userId: user.id, planId: plan.id, orderId: order.id },
      }),
    });

    const preference = await preferenceResponse.json().catch(() => null);
    if (!preferenceResponse.ok || !preference?.init_point) {
      return sendError(res, 502, 'Nao foi possivel criar o checkout no Mercado Pago.', 'checkout_failed');
    }

    order.preferenceId = preference.id;
    order.checkoutUrl = preference.init_point;
    await store.insertOrder(order);
    await store.insertEvent('checkout.created', user.id, { orderId: order.id, planId: plan.id });
    sendJson(res, 201, { ok: true, order, plan: planPublic(plan), checkoutUrl: order.checkoutUrl });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/payments/mercadopago/webhook') {
    const queryUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const body = await parseBody(req).catch(() => ({}));
    const paymentId = body?.data?.id ?? body?.id ?? queryUrl.searchParams.get('data.id') ?? queryUrl.searchParams.get('id');

    if (MERCADO_PAGO_WEBHOOK_SECRET) {
      // Validacao real de assinatura, conforme o formato documentado pelo
      // Mercado Pago: header `x-signature: ts=<epoch>,v1=<hmac_hex>` e
      // `x-request-id`. O HMAC-SHA256 e calculado sobre um "manifest" no
      // formato `id:{data.id};request-id:{x-request-id};ts:{ts};` usando o
      // segredo do webhook. Isso substitui a checagem antiga (que so
      // conferia se o segredo aparecia como substring no header, o que nao
      // corresponde ao esquema real do provedor e podia ser forjado).
      const signatureHeader = String(req.headers['x-signature'] ?? '');
      const requestId = String(req.headers['x-request-id'] ?? '');
      const parts = Object.fromEntries(
        signatureHeader
          .split(',')
          .map((part) => part.trim().split('='))
          .filter((pair) => pair.length === 2)
          .map(([key, value]) => [key.trim(), value.trim()]),
      );
      const ts = parts.ts;
      const v1 = parts.v1;
      const dataId = String(paymentId ?? queryUrl.searchParams.get('data.id') ?? '').toLowerCase();
      const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
      const expectedV1 = ts ? createHmac('sha256', MERCADO_PAGO_WEBHOOK_SECRET).update(manifest).digest('hex') : '';
      if (!ts || !v1 || !safeEqualStrings(v1, expectedV1)) {
        return sendError(res, 401, 'Webhook nao autorizado.', 'webhook_unauthorized');
      }
    }

    if (!paymentId) {
      sendJson(res, 200, { ok: true, ignored: true });
      return;
    }
    if (!MERCADO_PAGO_ACCESS_TOKEN) return sendError(res, 503, 'Pagamentos nao configurados.', 'payments_not_configured');

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}` },
    });
    const payment = await paymentResponse.json().catch(() => null);
    if (!paymentResponse.ok || !payment) return sendError(res, 502, 'Falha ao consultar pagamento.', 'payment_lookup_failed');
    const order = await store.getOrderById(payment.external_reference);
    if (!order) {
      sendJson(res, 200, { ok: true, ignored: true });
      return;
    }
    const paymentMeta = {
      providerPaymentId: String(payment.id),
      status: payment.status,
      statusDetail: payment.status_detail,
      paymentMethodId: payment.payment_method_id,
    };
    if (payment.status === 'approved') {
      await createLicenseForOrder(order, paymentMeta);
    } else {
      order.status = payment.status === 'rejected' || payment.status === 'cancelled' ? 'failed' : 'pending';
      order.updatedAt = nowIso();
      order.paymentMeta = { ...(order.paymentMeta ?? {}), ...paymentMeta };
      await store.updateOrder(order);
      await store.insertEvent('payment.updated', order.userId, { orderId: order.id, status: payment.status });
    }
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/progress') {
    const user = await requireAccess(req, res);
    if (!user) return;
    sendJson(res, 200, { ok: true, progress: await store.getProgress(user.id) });
    return;
  }

  if (req.method === 'PUT' && pathname === '/api/progress') {
    const user = await requireAccess(req, res);
    if (!user) return;
    const body = validateParsed(progressSchema, await parseBody(req), res);
    if (!body) return;
    const progress = body.progress;
    const saved = await store.upsertProgress(user.id, progress, sha256(JSON.stringify(progress)));
    await store.insertEvent('progress.synced', user.id);
    sendJson(res, 200, { ok: true, progress: saved });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/admin/licenses') {
    if (!isAdminAuthorized(req)) return sendError(res, 401, 'Admin token invalido.', 'admin_unauthorized');
    const body = await parseBody(req);
    const plan = plans[String(body.plan ?? 'pro').trim()] ?? plans.pro;
    const seats = Math.max(1, Math.min(10000, Number(body.seats ?? 1)));
    const expiresAt = body.expiresAt ? new Date(body.expiresAt).toISOString() : licenseExpiryForPlan(plan);
    const rawKey = `DEVQUEST-${randomBytes(4).toString('hex').toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    const license = await store.insertLicense({
      id: createId('lic'),
      keyHash: sha256(rawKey),
      plan: plan.id,
      seats,
      usedBy: [],
      status: 'active',
      expiresAt,
      createdAt: nowIso(),
      orderId: null,
      source: 'admin',
      note: String(body.note ?? '').slice(0, 300),
    });
    await store.insertEvent('license.created', 'admin', { licenseId: license.id, plan: plan.id, seats });
    sendJson(res, 201, { ok: true, licenseKey: rawKey, license: { ...license, keyHash: undefined } });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/admin/payments/confirm') {
    if (!isAdminAuthorized(req)) return sendError(res, 401, 'Admin token invalido.', 'admin_unauthorized');
    const body = await parseBody(req);
    const order = await store.getOrderById(String(body.orderId ?? ''));
    if (!order) return sendError(res, 404, 'Pedido nao encontrado.', 'order_not_found');
    if (!plans[order.planId]) return sendError(res, 400, 'Plano do pedido invalido.', 'invalid_plan');
    const license = await createLicenseForOrder(order, { manuallyConfirmed: true, note: String(body.note ?? '').slice(0, 300) });
    sendJson(res, 200, {
      ok: true,
      order,
      license: { ...license, keyHash: undefined, rawKey: undefined },
      licenseKey: license.rawKey,
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/admin/users/reset-password') {
    if (!isAdminAuthorized(req)) return sendError(res, 401, 'Admin token invalido.', 'admin_unauthorized');
    const body = await parseBody(req);
    const email = String(body.email ?? '').trim().toLowerCase();
    const user = await store.getUserByEmail(email);
    if (!user) return sendError(res, 404, 'Usuario nao encontrado.', 'user_not_found');
    // Sem servico de e-mail configurado, o admin gera uma senha temporaria
    // aqui e repassa manualmente para a pessoa (canal seguro, fora do app).
    const tempPassword = `${randomBytes(6).toString('hex')}Aa1`;
    user.passwordHash = hashPassword(tempPassword);
    user.failedLoginCount = 0;
    user.lockedUntil = null;
    user.updatedAt = nowIso();
    await store.updateUser(user);
    await store.insertEvent('user.password_reset_by_admin', user.id);
    sendJson(res, 200, { ok: true, email: user.email, temporaryPassword: tempPassword });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/admin/summary') {
    if (!isAdminAuthorized(req)) return sendError(res, 401, 'Admin token invalido.', 'admin_unauthorized');
    const [users, licenses, orders, revenueCents, activeLicenses, events] = await Promise.all([
      store.countUsers(),
      store.countLicenses(),
      store.countOrders(),
      store.sumPaidRevenueCents(),
      store.countActiveLicenses(),
      store.recentEvents(50),
    ]);
    sendJson(res, 200, {
      ok: true,
      users,
      licenses,
      orders,
      revenueCents,
      activeLicenses,
      plans: planList.map((plan) => planPublic(plan)),
      events,
    });
    return;
  }

  sendError(res, 404, 'Endpoint nao encontrado.', 'not_found');
}

function serveStatic(req, res, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const normalized = normalize(decodeURIComponent(requested)).replace(/^(\.\.[/\\])+/, '');
  const filePath = resolve(join(distDir, normalized));
  if (!filePath.startsWith(distDir)) return sendError(res, 403, 'Acesso negado.', 'forbidden');

  try {
    const stat = statSync(filePath);
    if (!stat.isFile()) throw new Error('not_file');
    const ext = extname(filePath);
    setHeaders(res, 200, {
      'Content-Type': mimeTypes[ext] ?? 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-store' : 'public, max-age=31536000, immutable',
    });
    res.end(readFileSync(filePath));
  } catch {
    try {
      setHeaders(res, 200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      res.end(readFileSync(join(distDir, 'index.html')));
    } catch {
      sendError(res, 404, 'Build nao encontrado. Rode npm run build.', 'dist_missing');
    }
  }
}

export { handleApi, serveStatic, withCors, seedDb, sendError, PORT, HOST };
