// Cliente para a API da DeepSeek.
//
// IMPORTANTE: a chave de API é fornecida pelo próprio usuário e fica guardada
// SOMENTE no localStorage do navegador dele — nunca é incluída no código-fonte
// nem enviada para qualquer servidor além da API oficial da DeepSeek.

export interface MentorMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';

export class MentorApiError extends Error {}

export async function askMentor(
  apiKey: string,
  messages: MentorMessage[],
  signal?: AbortSignal
): Promise<string> {
  if (!apiKey) {
    throw new MentorApiError('Nenhuma chave de API configurada.');
  }

  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      max_tokens: 800,
      temperature: 0.6,
    }),
    signal,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new MentorApiError('Chave de API inválida ou expirada. Confira nas Configurações.');
    }
    if (response.status === 429) {
      throw new MentorApiError('Limite de uso atingido. Tente novamente em alguns instantes.');
    }
    throw new MentorApiError(`Erro na API (${response.status}). Tente novamente.`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new MentorApiError('Resposta inesperada da API.');
  }
  return content;
}

export const MENTOR_SYSTEM_PROMPT = `Você é um mentor de programação experiente, parte do app "DevJourney" — uma plataforma de estudos para uma jornada de 18 meses se tornando desenvolvedor Full Stack (do zero ao sênior).

Seu tom: direto, encorajador sem ser piegas, técnico mas didático. Você explica conceitos com exemplos concretos, nunca enche linguiça.

Regras:
- Respostas em português do Brasil.
- Se a pergunta for sobre um erro de código, peça o trecho relevante se não foi enviado, e explique a causa raiz, não só a correção.
- Se a pessoa estiver travada/frustrada, valide brevemente a dificuldade e dê o próximo passo concreto — não um sermão motivacional longo.
- Prefira respostas curtas e específicas a respostas genéricas e longas.
- Quando fizer sentido, sugira um exercício prático pequeno para fixar o conceito.`;
