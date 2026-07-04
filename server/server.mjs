import { createServer } from 'node:http';
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const REQUIRE_LICENSE = process.env.REQUIRE_LICENSE === 'true';
const SEED_DEMO_LICENSE = process.env.SEED_DEMO_LICENSE !== 'false';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const jsonLimitBytes = 1024 * 1024;
const rateBuckets = new Map();

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

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
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
    version: 1,
    createdAt: nowIso(),
    users: [],
    licenses: [],
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
      plan: 'founder',
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
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    license: license
      ? {
          plan: license.plan,
          status: license.status,
          expiresAt: license.expiresAt,
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
      time: nowIso(),
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/auth/register') {
    const body = await parseBody(req);
    const name = String(body.name ?? '').trim();
    const email = normalizeEmail(body.email);
    const password = String(body.password ?? '');
    if (name.length < 2) return sendError(res, 400, 'Informe um nome valido.', 'invalid_name');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return sendError(res, 400, 'Informe um email valido.', 'invalid_email');
    if (password.length < 8) return sendError(res, 400, 'A senha precisa ter pelo menos 8 caracteres.', 'weak_password');
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
    const body = await parseBody(req);
    const email = normalizeEmail(body.email);
    const password = String(body.password ?? '');
    const user = db.users.find((item) => item.email === email && item.status !== 'disabled');
    if (!user || !verifyPassword(password, user.passwordHash.salt, user.passwordHash.hash)) {
      return sendError(res, 401, 'Email ou senha invalidos.', 'invalid_credentials');
    }
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
    const body = await parseBody(req);
    const key = String(body.licenseKey ?? '').trim().toUpperCase();
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

  if (req.method === 'GET' && pathname === '/api/progress') {
    const user = requireUser(req, res, db);
    if (!user) return;
    if (!hasAccess(user, db)) return sendError(res, 402, 'Ative uma licenca para sincronizar progresso.', 'license_required');
    sendJson(res, 200, { ok: true, progress: db.progress[user.id] ?? null });
    return;
  }

  if (req.method === 'PUT' && pathname === '/api/progress') {
    const user = requireUser(req, res, db);
    if (!user) return;
    if (!hasAccess(user, db)) return sendError(res, 402, 'Ative uma licenca para sincronizar progresso.', 'license_required');
    const body = await parseBody(req);
    const progress = body.progress;
    if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
      return sendError(res, 400, 'Payload de progresso invalido.', 'invalid_progress');
    }
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
    const plan = String(body.plan ?? 'pro').trim().slice(0, 40);
    const seats = Math.max(1, Math.min(10000, Number(body.seats ?? 1)));
    const expiresAt = body.expiresAt ? new Date(body.expiresAt).toISOString() : null;
    const rawKey = `DEVQUEST-${randomBytes(4).toString('hex').toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    const license = {
      id: createId('lic'),
      keyHash: sha256(rawKey),
      plan,
      seats,
      usedBy: [],
      status: 'active',
      expiresAt,
      createdAt: nowIso(),
      note: String(body.note ?? '').slice(0, 300),
    };
    db.licenses.push(license);
    addEvent(db, 'license.created', 'admin', { licenseId: license.id, plan, seats });
    saveDb(db);
    sendJson(res, 201, { ok: true, licenseKey: rawKey, license: { ...license, keyHash: undefined } });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/admin/summary') {
    const adminToken = req.headers['x-admin-token'];
    if (!adminToken || adminToken !== ADMIN_TOKEN) return sendError(res, 401, 'Admin token invalido.', 'admin_unauthorized');
    sendJson(res, 200, {
      ok: true,
      users: db.users.length,
      licenses: db.licenses.length,
      activeLicenses: db.licenses.filter(isLicenseValid).length,
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
