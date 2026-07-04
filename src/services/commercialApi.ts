export interface CommercialUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  license: null | {
    plan: string;
    status: string;
    expiresAt: string | null;
  };
}

export interface CommercialSession {
  token: string;
  user: CommercialUser;
  access: boolean;
}

export interface CloudProgress {
  data: Record<string, unknown>;
  updatedAt: string;
  checksum: string;
}

const TOKEN_KEY = 'devquest-commercial-token';
const LOCAL_PROGRESS_KEY = 'devquest-commercial-local-progress';

function apiBase() {
  return (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
}

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string | null) {
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function readLocalCommercialProgress(): Record<string, unknown> {
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_PROGRESS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function writeLocalCommercialProgress(progress: Record<string, unknown>) {
  window.localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress));
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  const token = getStoredToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${apiBase()}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message ?? `Erro ${response.status}`;
    throw new Error(message);
  }
  return data as T;
}

export async function healthCheck(): Promise<{ ok: boolean; mode: string; time: string }> {
  return apiRequest('/api/health', { method: 'GET' });
}

export async function registerCommercialAccount(input: {
  name: string;
  email: string;
  password: string;
}): Promise<CommercialSession> {
  const session = await apiRequest<CommercialSession>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  storeToken(session.token);
  return session;
}

export async function loginCommercialAccount(input: {
  email: string;
  password: string;
}): Promise<CommercialSession> {
  const session = await apiRequest<CommercialSession>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  storeToken(session.token);
  return session;
}

export async function getCommercialMe(): Promise<Omit<CommercialSession, 'token'>> {
  return apiRequest('/api/me', { method: 'GET' });
}

export async function activateCommercialLicense(licenseKey: string): Promise<Omit<CommercialSession, 'token'>> {
  return apiRequest('/api/license/activate', {
    method: 'POST',
    body: JSON.stringify({ licenseKey }),
  });
}

export async function loadCloudProgress(): Promise<{ ok: boolean; progress: CloudProgress | null }> {
  return apiRequest('/api/progress', { method: 'GET' });
}

export async function saveCloudProgress(progress: Record<string, unknown>): Promise<{ ok: boolean; progress: CloudProgress }> {
  return apiRequest('/api/progress', {
    method: 'PUT',
    body: JSON.stringify({ progress }),
  });
}
