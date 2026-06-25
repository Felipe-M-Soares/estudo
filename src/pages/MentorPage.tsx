import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Bot, AlertTriangle, Loader2, ExternalLink, Clock, Activity } from 'lucide-react';
import {
  askMentor,
  MentorApiError,
  MENTOR_SYSTEM_PROMPT,
  buildPerformanceSummary,
  type MentorMessage,
  type MentorErrorCode,
} from '../utils/gemini';
import { modules, modulesById } from '../data';
import type { UserProgress } from '../data/types';

interface MentorPageProps {
  apiKey: string;
  currentModuleId: string;
  progress: UserProgress;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface MentorError {
  message: string;
  code: MentorErrorCode;
}

const SUGGESTIONS = [
  'Explica de outro jeito o que é uma Promise',
  'Por que minha API retorna 401 mesmo com o token certo?',
  'Me dá um exercício rápido sobre o que estou estudando agora',
  'Qual a diferença entre SQL e NoSQL na prática?',
];

export function MentorPage({ apiKey, currentModuleId, progress }: MentorPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<MentorError | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentModule = modulesById[currentModuleId];

  const overallPercent = useMemo(() => {
    const total = modules.length * 100;
    const sum = modules.reduce((acc, m) => acc + (progress.moduleProgress[m.id] ?? 0), 0);
    return total === 0 ? 0 : Math.round((sum / total) * 100);
  }, [progress.moduleProgress]);

  const moduleStats = useMemo(() => {
    return modules.map((m) => {
      const exerciseIds = m.exercises.map((e) => e.id);
      const totalAttempted = exerciseIds.reduce((sum, id) => sum + (progress.exerciseAttempts[id] ?? 0), 0);
      const correctCount = exerciseIds.filter((id) => progress.completedExercises[id]).length;
      return { moduleTitle: m.title, correctCount, totalAttempted };
    });
  }, [progress.exerciseAttempts, progress.completedExercises]);

  const strugglingExerciseCount = useMemo(() => {
    return Object.entries(progress.exerciseAttempts).filter(
      ([exerciseId, attempts]) => attempts >= 3 && !progress.completedExercises[exerciseId]
    ).length;
  }, [progress.exerciseAttempts, progress.completedExercises]);

  const performanceSummary = useMemo(
    () =>
      buildPerformanceSummary({
        moduleStats,
        strugglingExerciseCount,
        streakDays: progress.streakDays,
        overallPercent,
      }),
    [moduleStats, strugglingExerciseCount, progress.streakDays, overallPercent]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, error]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const moduleContext = currentModule
        ? `\n\nContexto do módulo: a pessoa está atualmente estudando "${currentModule.title}" (Mês ${currentModule.month}).`
        : '';
      const performanceContext = `\n\nResumo de desempenho real da pessoa (use para personalizar, sem citar números de forma fria): ${performanceSummary}`;
      const apiMessages: MentorMessage[] = [
        { role: 'system', content: MENTOR_SYSTEM_PROMPT + moduleContext + performanceContext },
        ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
      ];
      const reply = await askMentor(apiKey, apiMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      if (err instanceof MentorApiError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: 'Não foi possível falar com o mentor agora. Tente novamente.', code: 'unknown' });
      }
    } finally {
      setLoading(false);
    }
  }

  if (!apiKey) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15">
          <Bot size={26} className="text-violet-400" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-base-50">Mentor IA</h1>
        <p className="mt-2 text-base-300">
          Configure sua chave de API do Google Gemini (gratuita) para conversar com um mentor que conhece exatamente onde você
          está na jornada.
        </p>
        <Link
          to="/configuracoes"
          className="mt-5 inline-block rounded-lg bg-mint-400 px-5 py-2.5 text-sm font-semibold text-base-950 hover:opacity-90"
        >
          Ir para Configurações
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-57px)] max-w-2xl flex-col px-4 py-6 lg:px-8">
      <div className="mb-4">
        <h1 className="font-display text-xl font-bold text-base-50">🤖 Mentor IA</h1>
        {currentModule && (
          <p className="text-xs text-base-400">Sabe que você está em: {currentModule.emoji} {currentModule.title}</p>
        )}
        {(strugglingExerciseCount > 0 || overallPercent > 0) && (
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-violet-300">
            <Activity size={11} /> Também ajusta as respostas com base no seu desempenho real
          </p>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 && !error && (
          <div className="space-y-2">
            <p className="text-sm text-base-400">Sugestões para começar:</p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="block w-full rounded-xl card-surface card-surface-hover px-4 py-2.5 text-left text-sm text-base-200"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-mint-400 text-base-950' : 'card-surface text-base-100'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl card-surface px-4 py-2.5 text-sm text-base-400">
              <Loader2 size={14} className="animate-spin" /> Pensando...
            </div>
          </div>
        )}

        {error?.code === 'rate-limit' && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <Clock size={15} /> Cota gratuita diária do Gemini esgotada
            </div>
            <p className="mt-2 text-sm text-base-200">
              O plano gratuito do Google Gemini tem um limite de mensagens por dia (renovado automaticamente). Isso não é um
              problema com sua chave — ela continua válida, só é preciso esperar a cota resetar.
            </p>
            <p className="mt-2 text-sm text-base-200">Para resolver:</p>
            <ol className="mt-1 ml-4 list-decimal space-y-1 text-sm text-base-200">
              <li>Espere algumas horas — a cota gratuita reseta diariamente</li>
              <li>Ou acompanhe seu uso atual no Google AI Studio</li>
            </ol>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-2 text-sm font-semibold text-base-950 hover:opacity-90"
            >
              Ver minha chave no AI Studio <ExternalLink size={13} />
            </a>
          </div>
        )}

        {error && error.code !== 'rate-limit' && (
          <div className="flex items-center gap-2 rounded-xl border border-ember-400/30 bg-ember-500/10 px-4 py-2.5 text-sm text-ember-300">
            <AlertTriangle size={14} className="shrink-0" /> {error.message}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-center gap-2 border-t border-base-700 pt-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte qualquer coisa sobre o que está estudando..."
          className="flex-1 rounded-xl border border-base-600 bg-base-850 px-4 py-2.5 text-sm text-base-100 outline-none focus:border-mint-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint-400 text-base-950 disabled:opacity-40"
          aria-label="Enviar"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
