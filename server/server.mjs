import { createServer } from 'node:http';
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');
const dataDir = resolve(process.env.DATA_DIR ?? join(rootDir, '.data'));
const dbPath = resolve(dataDir, 'devquest-db.json');

const PORT = Number(process.env.PORT ?? 8787);
const HOST = process.env.HOST ?? '0.0.0.0';
const TOKEN_SECRET = process.env.TOKEN_SECRET ?? 'devquest-local-change-this-secret';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'devquest-admin-change-me';
const TOKEN_TTL_SECONDS = Number(process.env.TOKEN_TTL_SECONDS ?? 60 * 60 * 24 * 7);
const REQUIRE_LICENSE = process.env.REQUIRE_LICENSE !== 'false';
const SEED_DEMO_LICENSE = process.env.SEED_DEMO_LICENSE === 'true';
const PUBLIC_APP_URL = (process.env.PUBLIC_APP_URL ?? '').replace(/\/$/, '');
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? '';
const MERCADO_PAGO_WEBHOOK_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET ?? '';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

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

function emptyDb() {
  return {
    version: 2,
    createdAt: nowIso(),
    users: [],
    licenses: [],
    orders: [],
    progress: {},
    events: [],
  };
}

function loadDb() {
  mkdirSync(dataDir, { recursive: true });
  try {
    const parsed = JSON.parse(readFileSync(dbPath, 'utf8'));
    return { ...emptyDb(), ...parsed };
  } catch {
    const db = emptyDb();
    saveDb(db);
    return db;
  }
}

function saveDb(db) {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function seedDb() {
  const db = loadDb();
  if (SEED_DEMO_LICENSE && !db.licenses.some((license) => license.keyHash === sha256('DEVQUEST-DEMO-2026'))) {
    db.licenses.push({
      id: createId('lic'),
      keyHash: sha256('DEVQUEST-DEMO-2026'),
      plan: 'lifetime',
      seats: 25,
      usedBy: [],
      status: 'active',
      expiresAt: null,
      createdAt: nowIso(),
      note: 'Seed de teste. Desative com SEED_DEMO_LICENSE=false em producao.',
    });
    saveDb(db);
  }
}

function publicUser(user, db) {
  const license = user.licenseId ? db.licenses.find((item) => item.id === user.licenseId) : null;
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

function hasAccess(user, db) {
  if (!REQUIRE_LICENSE) return true;
  const license = user.licenseId ? db.licenses.find((item) => item.id === user.licenseId) : null;
  return isLicenseValid(license);
}

function requireAccess(req, res, db) {
  const user = requireUser(req, res, db);
  if (!user) return null;
  if (!hasAccess(user, db)) {
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

function createLicenseForOrder(db, order, paymentMeta = {}) {
  const plan = plans[order.planId];
  if (!plan) throw new Error('invalid_plan');
  const existing = db.licenses.find((license) => license.orderId === order.id);
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
  db.licenses.push(license);
  const user = db.users.find((item) => item.id === order.userId);
  if (user) {
    user.licenseId = license.id;
    user.updatedAt = nowIso();
  }
  order.status = 'paid';
  order.paidAt = nowIso();
  order.licenseId = license.id;
  order.paymentMeta = { ...(order.paymentMeta ?? {}), ...paymentMeta };
  addEvent(db, 'payment.approved', order.userId, { orderId: order.id, planId: plan.id });
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

function addEvent(db, type, userId, meta = {}) {
  db.events.unshift({ id: createId('evt'), type, userId, meta, createdAt: nowIso() });
  db.events = db.events.slice(0, 1000);
}

function setHeaders(res, status, extra = {}) {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com https://api.deepseek.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
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

function getBearer(req) {
  const header = req.headers.authorization ?? '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

function requireUser(req, res, db) {
  const token = getBearer(req);
  const payload = verifyToken(token);
  if (!payload?.sub) {
    sendError(res, 401, 'Sessao invalida ou expirada.', 'unauthorized');
    return null;
  }
  const user = db.users.find((item) => item.id === payload.sub && item.status !== 'disabled');
  if (!user) {
    sendError(res, 401, 'Usuario nao encontrado.', 'unauthorized');
    return null;
  }
  return user;
}

async function handleApi(req, res, pathname) {
  if (!rateLimit(req, res, pathname.startsWith('/api/auth') ? 'auth' : 'api')) return;
  const db = loadDb();

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, {
      ok: true,
      app: 'DevQuest',
      mode: REQUIRE_LICENSE ? 'licensed' : 'open',
      payments: MERCADO_PAGO_ACCESS_TOKEN ? 'mercadopago' : 'not_configured',
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
    if (db.users.some((user) => user.email === email)) return sendError(res, 409, 'Email ja cadastrado.', 'email_exists');

    const passwordHash = hashPassword(password);
    const user = {
      id: createId('usr'),
      name,
      email,
      passwordHash,
      role: db.users.length === 0 ? 'owner' : 'student',
      status: 'active',
      licenseId: null,
      failedLoginCount: 0,
      lockedUntil: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    db.users.push(user);
    addEvent(db, 'user.registered', user.id);
    saveDb(db);

    const token = signToken({ sub: user.id, role: user.role });
    sendJson(res, 201, { ok: true, token, user: publicUser(user, db), access: hasAccess(user, db) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/auth/login') {
    const body = validateParsed(loginSchema, await parseBody(req), res);
    if (!body) return;
    const { email, password } = body;
    const user = db.users.find((item) => item.email === email && item.status !== 'disabled');
    if (user?.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
      return sendError(res, 423, 'Muitas tentativas. Aguarde alguns minutos e tente novamente.', 'account_locked');
    }
    if (!user || !verifyPassword(password, user.passwordHash.salt, user.passwordHash.hash)) {
      if (user) {
        user.failedLoginCount = Number(user.failedLoginCount ?? 0) + 1;
        if (user.failedLoginCount >= 6) user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        user.updatedAt = nowIso();
        addEvent(db, 'user.login_failed', user.id);
        saveDb(db);
      }
      return sendError(res, 401, 'Email ou senha invalidos.', 'invalid_credentials');
    }
    user.failedLoginCount = 0;
    user.lockedUntil = null;
    user.lastLoginAt = nowIso();
    user.updatedAt = nowIso();
    addEvent(db, 'user.login', user.id);
    saveDb(db);
    const token = signToken({ sub: user.id, role: user.role });
    sendJson(res, 200, { ok: true, token, user: publicUser(user, db), access: hasAccess(user, db) });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/me') {
    const user = requireUser(req, res, db);
    if (!user) return;
    sendJson(res, 200, { ok: true, user: publicUser(user, db), access: hasAccess(user, db) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/license/activate') {
    const user = requireUser(req, res, db);
    if (!user) return;
    const body = validateParsed(licenseSchema, await parseBody(req), res);
    if (!body) return;
    const key = body.licenseKey;
    const license = db.licenses.find((item) => item.keyHash === sha256(key));
    if (!isLicenseValid(license)) return sendError(res, 404, 'Licenca invalida, expirada ou inativa.', 'invalid_license');
    if (!license.usedBy.includes(user.id) && license.usedBy.length >= license.seats) {
      return sendError(res, 409, 'Esta licenca atingiu o limite de assentos.', 'seat_limit');
    }
    if (!license.usedBy.includes(user.id)) license.usedBy.push(user.id);
    user.licenseId = license.id;
    user.updatedAt = nowIso();
    addEvent(db, 'license.activated', user.id, { licenseId: license.id });
    saveDb(db);
    sendJson(res, 200, { ok: true, user: publicUser(user, db), access: hasAccess(user, db) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/checkout') {
    const user = requireUser(req, res, db);
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
      db.orders.push({ ...order, status: 'configuration_required' });
      addEvent(db, 'checkout.configuration_required', user.id, { orderId: order.id, planId: plan.id });
      saveDb(db);
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
    db.orders.push(order);
    addEvent(db, 'checkout.created', user.id, { orderId: order.id, planId: plan.id });
    saveDb(db);
    sendJson(res, 201, { ok: true, order, plan: planPublic(plan), checkoutUrl: order.checkoutUrl });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/payments/mercadopago/webhook') {
    const signature = String(req.headers['x-signature'] ?? '');
    if (MERCADO_PAGO_WEBHOOK_SECRET && !signature.includes(MERCADO_PAGO_WEBHOOK_SECRET)) {
      return sendError(res, 401, 'Webhook nao autorizado.', 'webhook_unauthorized');
    }
    const body = await parseBody(req).catch(() => ({}));
    const queryUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const paymentId = body?.data?.id ?? body?.id ?? queryUrl.searchParams.get('data.id') ?? queryUrl.searchParams.get('id');
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
    const order = db.orders.find((item) => item.id === payment.external_reference);
    if (!order) {
      sendJson(res, 200, { ok: true, ignored: true });
      return;
    }
    order.updatedAt = nowIso();
    order.paymentMeta = {
      providerPaymentId: String(payment.id),
      status: payment.status,
      statusDetail: payment.status_detail,
      paymentMethodId: payment.payment_method_id,
    };
    if (payment.status === 'approved') {
      createLicenseForOrder(db, order, order.paymentMeta);
    } else {
      order.status = payment.status === 'rejected' || payment.status === 'cancelled' ? 'failed' : 'pending';
      addEvent(db, 'payment.updated', order.userId, { orderId: order.id, status: payment.status });
    }
    saveDb(db);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/progress') {
    const user = requireAccess(req, res, db);
    if (!user) return;
    sendJson(res, 200, { ok: true, progress: db.progress[user.id] ?? null });
    return;
  }

  if (req.method === 'PUT' && pathname === '/api/progress') {
    const user = requireAccess(req, res, db);
    if (!user) return;
    const body = validateParsed(progressSchema, await parseBody(req), res);
    if (!body) return;
    const progress = body.progress;
    db.progress[user.id] = {
      data: progress,
      updatedAt: nowIso(),
      checksum: sha256(JSON.stringify(progress)),
    };
    addEvent(db, 'progress.synced', user.id);
    saveDb(db);
    sendJson(res, 200, { ok: true, progress: db.progress[user.id] });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/admin/licenses') {
    const adminToken = req.headers['x-admin-token'];
    if (!adminToken || adminToken !== ADMIN_TOKEN) return sendError(res, 401, 'Admin token invalido.', 'admin_unauthorized');
    const body = await parseBody(req);
    const plan = plans[String(body.plan ?? 'pro').trim()] ?? plans.pro;
    const seats = Math.max(1, Math.min(10000, Number(body.seats ?? 1)));
    const expiresAt = body.expiresAt ? new Date(body.expiresAt).toISOString() : licenseExpiryForPlan(plan);
    const rawKey = `DEVQUEST-${randomBytes(4).toString('hex').toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    const license = {
      id: createId('lic'),
      keyHash: sha256(rawKey),
      plan: plan.id,
      seats,
      usedBy: [],
      status: 'active',
      expiresAt,
      createdAt: nowIso(),
      note: String(body.note ?? '').slice(0, 300),
    };
    db.licenses.push(license);
    addEvent(db, 'license.created', 'admin', { licenseId: license.id, plan: plan.id, seats });
    saveDb(db);
    sendJson(res, 201, { ok: true, licenseKey: rawKey, license: { ...license, keyHash: undefined } });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/admin/payments/confirm') {
    const adminToken = req.headers['x-admin-token'];
    if (!adminToken || adminToken !== ADMIN_TOKEN) return sendError(res, 401, 'Admin token invalido.', 'admin_unauthorized');
    const body = await parseBody(req);
    const order = db.orders.find((item) => item.id === String(body.orderId ?? ''));
    if (!order) return sendError(res, 404, 'Pedido nao encontrado.', 'order_not_found');
    if (!plans[order.planId]) return sendError(res, 400, 'Plano do pedido invalido.', 'invalid_plan');
    const license = createLicenseForOrder(db, order, { manuallyConfirmed: true, note: String(body.note ?? '').slice(0, 300) });
    saveDb(db);
    sendJson(res, 200, {
      ok: true,
      order,
      license: { ...license, keyHash: undefined, rawKey: undefined },
      licenseKey: license.rawKey,
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/admin/summary') {
    const adminToken = req.headers['x-admin-token'];
    if (!adminToken || adminToken !== ADMIN_TOKEN) return sendError(res, 401, 'Admin token invalido.', 'admin_unauthorized');
    sendJson(res, 200, {
      ok: true,
      users: db.users.length,
      licenses: db.licenses.length,
      orders: db.orders.length,
      revenueCents: db.orders.filter((order) => order.status === 'paid').reduce((sum, order) => sum + Number(order.amountCents ?? 0), 0),
      activeLicenses: db.licenses.filter(isLicenseValid).length,
      plans: planList.map((plan) => planPublic(plan)),
      events: db.events.slice(0, 50),
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

seedDb();

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
