// Hash simples para PIN de perfis locais.
//
// IMPORTANTE: isso NÃO é criptografia de verdade — é só uma ofuscação básica
// para o PIN não ficar em texto puro no localStorage. O propósito aqui é
// evitar que outra pessoa usando o mesmo navegador veja o PIN "no olho" ao
// abrir o DevTools, não proteger dados sensíveis de verdade. Como tudo nesse
// app é local (progresso de estudos, sem dados pessoais sensíveis), isso é
// proporcional ao risco real.
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`devjourney-salt-${pin}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  const computed = await hashPin(pin);
  return computed === hash;
}
