// Hash de PIN para perfis locais, com salt único por perfil.
//
// IMPORTANTE: isso NÃO é criptografia de nível bancário — é uma trava simples
// para o PIN não ficar em texto puro no localStorage e para que perfis
// diferentes não compartilhem o mesmo salt (o que permitiria comparar hashes
// entre perfis ou pré-computar uma tabela única para todos os usuários do
// app). Como tudo aqui é local e sem dados sensíveis reais, esse nível de
// proteção é proporcional ao risco — mas usar um salt aleatório por perfil
// é uma prática básica correta que não custa nada implementar.

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

async function digest(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${pin}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

export interface PinHash {
  hash: string;
  salt: string;
}

export async function hashPin(pin: string): Promise<PinHash> {
  const salt = generateSalt();
  const hash = await digest(pin, salt);
  return { hash, salt };
}

export async function verifyPin(pin: string, stored: PinHash): Promise<boolean> {
  const computed = await digest(pin, stored.salt);
  return computed === stored.hash;
}

// Mantido para migrar perfis criados antes do salt por perfil existir.
export async function legacyHashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`devjourney-salt-${pin}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(hashBuffer));
}
