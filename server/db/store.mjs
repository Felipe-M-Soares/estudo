import { randomBytes } from 'node:crypto';
import { supabase } from './supabase.mjs';

// Esta camada e a UNICA parte do backend que sabe o nome das colunas do
// Supabase. O resto do server.mjs continua trabalhando com os mesmos objetos
// em camelCase de sempre (user.passwordHash.salt, license.usedBy, etc.) -
// isso mantem toda a logica de negocio (validacoes, regras de licenca,
// checkout) identica a versao anterior, so trocando "onde os dados moram".

function createId(prefix) {
  return `${prefix}_${randomBytes(16).toString('hex')}`;
}

function throwIfError(error, context) {
  if (error) {
    const wrapped = new Error(`[supabase:${context}] ${error.message}`);
    wrapped.cause = error;
    throw wrapped;
  }
}

// ---------- users ----------

function mapUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: { salt: row.password_salt, hash: row.password_hash },
    role: row.role,
    status: row.status,
    licenseId: row.license_id,
    failedLoginCount: row.failed_login_count,
    lockedUntil: row.locked_until,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function userToRow(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password_salt: user.passwordHash.salt,
    password_hash: user.passwordHash.hash,
    role: user.role,
    status: user.status,
    license_id: user.licenseId ?? null,
    failed_login_count: user.failedLoginCount ?? 0,
    locked_until: user.lockedUntil ?? null,
    last_login_at: user.lastLoginAt ?? null,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase.from('devquest_users').select('*').eq('email', email).maybeSingle();
  throwIfError(error, 'getUserByEmail');
  return mapUserRow(data);
}

export async function getUserById(id) {
  if (!id) return null;
  const { data, error } = await supabase.from('devquest_users').select('*').eq('id', id).maybeSingle();
  throwIfError(error, 'getUserById');
  return mapUserRow(data);
}

export async function insertUser(user) {
  const { data, error } = await supabase.from('devquest_users').insert(userToRow(user)).select().single();
  throwIfError(error, 'insertUser');
  return mapUserRow(data);
}

export async function updateUser(user) {
  const { data, error } = await supabase.from('devquest_users').update(userToRow(user)).eq('id', user.id).select().single();
  throwIfError(error, 'updateUser');
  return mapUserRow(data);
}

export async function countUsers() {
  const { count, error } = await supabase.from('devquest_users').select('*', { count: 'exact', head: true });
  throwIfError(error, 'countUsers');
  return count ?? 0;
}

// ---------- licenses ----------

function mapLicenseRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    keyHash: row.key_hash,
    plan: row.plan,
    seats: row.seats,
    usedBy: row.used_by ?? [],
    status: row.status,
    expiresAt: row.expires_at,
    orderId: row.order_id,
    source: row.source,
    note: row.note,
    createdAt: row.created_at,
  };
}

function licenseToRow(license) {
  return {
    id: license.id,
    key_hash: license.keyHash,
    plan: license.plan,
    seats: license.seats,
    used_by: license.usedBy ?? [],
    status: license.status,
    expires_at: license.expiresAt ?? null,
    order_id: license.orderId ?? null,
    source: license.source ?? null,
    note: license.note ?? null,
    created_at: license.createdAt,
  };
}

export async function getLicenseById(id) {
  if (!id) return null;
  const { data, error } = await supabase.from('devquest_licenses').select('*').eq('id', id).maybeSingle();
  throwIfError(error, 'getLicenseById');
  return mapLicenseRow(data);
}

export async function getLicenseByKeyHash(keyHash) {
  const { data, error } = await supabase.from('devquest_licenses').select('*').eq('key_hash', keyHash).maybeSingle();
  throwIfError(error, 'getLicenseByKeyHash');
  return mapLicenseRow(data);
}

export async function getLicenseByOrderId(orderId) {
  const { data, error } = await supabase.from('devquest_licenses').select('*').eq('order_id', orderId).maybeSingle();
  throwIfError(error, 'getLicenseByOrderId');
  return mapLicenseRow(data);
}

export async function insertLicense(license) {
  const { data, error } = await supabase.from('devquest_licenses').insert(licenseToRow(license)).select().single();
  throwIfError(error, 'insertLicense');
  return mapLicenseRow(data);
}

export async function updateLicense(license) {
  const { data, error } = await supabase.from('devquest_licenses').update(licenseToRow(license)).eq('id', license.id).select().single();
  throwIfError(error, 'updateLicense');
  return mapLicenseRow(data);
}

export async function countLicenses() {
  const { count, error } = await supabase.from('devquest_licenses').select('*', { count: 'exact', head: true });
  throwIfError(error, 'countLicenses');
  return count ?? 0;
}

export async function countActiveLicenses() {
  const nowIso = new Date().toISOString();
  const { count, error } = await supabase
    .from('devquest_licenses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`);
  throwIfError(error, 'countActiveLicenses');
  return count ?? 0;
}

// ---------- orders ----------

function mapOrderRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    planId: row.plan_id,
    amountCents: row.amount_cents,
    currency: row.currency,
    provider: row.provider,
    status: row.status,
    preferenceId: row.preference_id,
    checkoutUrl: row.checkout_url,
    licenseId: row.license_id,
    paymentMeta: row.payment_meta ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    paidAt: row.paid_at,
  };
}

function orderToRow(order) {
  return {
    id: order.id,
    user_id: order.userId,
    plan_id: order.planId,
    amount_cents: order.amountCents,
    currency: order.currency,
    provider: order.provider,
    status: order.status,
    preference_id: order.preferenceId ?? null,
    checkout_url: order.checkoutUrl ?? null,
    license_id: order.licenseId ?? null,
    payment_meta: order.paymentMeta ?? {},
    created_at: order.createdAt,
    updated_at: order.updatedAt,
    paid_at: order.paidAt ?? null,
  };
}

export async function getOrderById(id) {
  if (!id) return null;
  const { data, error } = await supabase.from('devquest_orders').select('*').eq('id', id).maybeSingle();
  throwIfError(error, 'getOrderById');
  return mapOrderRow(data);
}

export async function insertOrder(order) {
  const { data, error } = await supabase.from('devquest_orders').insert(orderToRow(order)).select().single();
  throwIfError(error, 'insertOrder');
  return mapOrderRow(data);
}

export async function updateOrder(order) {
  const { data, error } = await supabase.from('devquest_orders').update(orderToRow(order)).eq('id', order.id).select().single();
  throwIfError(error, 'updateOrder');
  return mapOrderRow(data);
}

export async function countOrders() {
  const { count, error } = await supabase.from('devquest_orders').select('*', { count: 'exact', head: true });
  throwIfError(error, 'countOrders');
  return count ?? 0;
}

export async function sumPaidRevenueCents() {
  const { data, error } = await supabase.from('devquest_orders').select('amount_cents').eq('status', 'paid');
  throwIfError(error, 'sumPaidRevenueCents');
  return (data ?? []).reduce((sum, row) => sum + Number(row.amount_cents ?? 0), 0);
}

// ---------- progress ----------

export async function getProgress(userId) {
  const { data, error } = await supabase.from('devquest_progress').select('*').eq('user_id', userId).maybeSingle();
  throwIfError(error, 'getProgress');
  if (!data) return null;
  return { data: data.data, updatedAt: data.updated_at, checksum: data.checksum };
}

export async function upsertProgress(userId, progressData, checksum) {
  const { data, error } = await supabase
    .from('devquest_progress')
    .upsert(
      { user_id: userId, data: progressData, checksum, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    )
    .select()
    .single();
  throwIfError(error, 'upsertProgress');
  return { data: data.data, updatedAt: data.updated_at, checksum: data.checksum };
}

// ---------- events (auditoria) ----------

export async function insertEvent(type, userId, meta = {}) {
  const { error } = await supabase.from('devquest_events').insert({
    id: createId('evt'),
    type,
    user_id: userId ?? null,
    meta,
  });
  // Auditoria nunca deve derrubar a requisicao principal do usuario; so loga.
  if (error) console.error('[supabase:insertEvent]', error.message);
}

export async function recentEvents(limit = 50) {
  const { data, error } = await supabase
    .from('devquest_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  throwIfError(error, 'recentEvents');
  return (data ?? []).map((row) => ({ id: row.id, type: row.type, userId: row.user_id, meta: row.meta, createdAt: row.created_at }));
}

// ---------- seed opcional de licenca de demonstracao ----------

export async function ensureSeedLicense({ keyHash, plan, seats, note }) {
  const existing = await getLicenseByKeyHash(keyHash);
  if (existing) return;
  await insertLicense({
    id: createId('lic'),
    keyHash,
    plan,
    seats,
    usedBy: [],
    status: 'active',
    expiresAt: null,
    orderId: null,
    source: 'seed',
    note,
    createdAt: new Date().toISOString(),
  });
}
