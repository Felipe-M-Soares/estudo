// Cliente para a API do Google Gemini (gratuita, via Google AI Studio).
//
// IMPORTANTE: a chave de API é fornecida pelo próprio usuário e fica guardada
// SOMENTE no localStorage do navegador dele — nunca é incluída no código-fonte
// nem enviada para qualquer servidor além da API oficial do Google.

export interface MentorMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type MentorErrorCode = 'no-key' | 'invalid-key' | 'no-balance' | 'rate-limit' | 'unknown';

export class MentorApiError extends Error {
  code: MentorErrorCode;
  constructor(message: string, code: MentorErrorCode = 'unknown') {
    super(message);
    this.code = code;
  }
}

export async function askMentor(
  apiKey: string,
  messages: MentorMessage[],
  signal?: AbortSignal
): Promise<string> {
  if (!apiKey) {
    throw new MentorApiError('Nenhuma chave de API configurada.', 'no-key');
  }

  // A API do Gemini separa a instrução de sistema do histórico de turnos, e usa
  // "model" em vez de "assistant" para identificar a resposta da IA.
  const systemMessages = messages.filter((m) => m.role === 'system');
  const turnMessages = messages.filter((m) => m.role !== 'system');

  const contents = turnMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.6,
    },
  };

  if (systemMessages.length > 0) {
    body.systemInstruction = {
      parts: [{ text: systemMessages.map((m) => m.content).join('\n\n') }],
    };
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    if (response.status === 400 || response.status === 403) {
      throw new MentorApiError('Chave de API inválida. Confira nas Configurações.', 'invalid-key');
    }
    if (response.status === 429) {
      throw new MentorApiError(
        'Limite gratuito diário do Gemini atingido. A cota reseta automaticamente em algumas horas — tente de novo mais tarde.',
        'rate-limit'
      );
    }
    throw new MentorApiError(`Erro na API (${response.status}). Tente novamente.`, 'unknown');
  }

  const data = await response.json();

  const blockReason = data?.promptFeedback?.blockReason;
  if (blockReason) {
    throw new MentorApiError('A resposta foi bloqueada pelos filtros de segurança do Gemini. Tente reformular a pergunta.', 'unknown');
  }

  const content = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('');
  if (typeof content !== 'string' || !content) {
    throw new MentorApiError('Resposta inesperada da API.', 'unknown');
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
- Quando fizer sentido, sugira um exercício prático pequeno para fixar o conceito.
- Se receber um resumo de desempenho da pessoa, use isso para personalizar — por exemplo, se ela está com dificuldade recorrente num tópico específico, mencione isso com gentileza e ofereça reforço nesse ponto, sem fazer a pessoa se sentir mal por isso.`;

export interface PerformanceSummaryInput {
  moduleStats: { moduleTitle: string; correctCount: number; totalAttempted: number }[];
  strugglingExerciseCount: number; // exercícios com 3+ tentativas erradas
  streakDays: number;
  overallPercent: number;
}

export function buildPerformanceSummary(input: PerformanceSummaryInput): string {
  const weakModules = input.moduleStats
    .filter((m) => m.totalAttempted >= 3 && m.correctCount / m.totalAttempted < 0.6)
    .map((m) => m.moduleTitle);

  const parts: string[] = [];
  parts.push(`Progresso geral na jornada: ${input.overallPercent}%.`);
  parts.push(`Sequência de estudo atual: ${input.streakDays} dia(s).`);
  if (weakModules.length > 0) {
    parts.push(`Módulos com taxa de acerto mais baixa (menos de 60%): ${weakModules.join(', ')}.`);
  }
  if (input.strugglingExerciseCount > 0) {
    parts.push(`${input.strugglingExerciseCount} exercício(s) que essa pessoa errou 3 ou mais vezes antes de acertar (ou ainda não acertou).`);
  }
  return parts.join(' ');
}
