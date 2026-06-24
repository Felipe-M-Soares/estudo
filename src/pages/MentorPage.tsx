import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Bot, AlertTriangle, Loader2 } from 'lucide-react';
import { askMentor, MentorApiError, MENTOR_SYSTEM_PROMPT, type MentorMessage } from '../utils/deepseek';
import { modulesById } from '../data';

interface MentorPageProps {
  apiKey: string;
  currentModuleId: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Explica de outro jeito o que é uma Promise',
  'Por que minha API retorna 401 mesmo com o token certo?',
  'Me dá um exercício rápido sobre o que estou estudando agora',
  'Qual a diferença entre SQL e NoSQL na prática?',
];

export function MentorPage({ apiKey, currentModuleId }: MentorPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentModule = modulesById[currentModuleId];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const context = currentModule
        ? `\n\nContexto: a pessoa está atualmente estudando o módulo "${currentModule.title}" (Mês ${currentModule.month}).`
        : '';
      const apiMessages: MentorMessage[] = [
        { role: 'system', content: MENTOR_SYSTEM_PROMPT + context },
        ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
      ];
      const reply = await askMentor(apiKey, apiMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      if (err instanceof MentorApiError) {
        setError(err.message);
      } else {
        setError('Não foi possível falar com o mentor agora. Tente novamente.');
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
          Configure sua chave de API da DeepSeek para conversar com um mentor que conhece exatamente onde você está na jornada.
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
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-base-400">Sugestões para começar:</p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="block w-full rounded-xl border border-base-700 bg-base-850 px-4 py-2.5 text-left text-sm text-base-200 hover:border-violet-400/40"
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
                m.role === 'user' ? 'bg-mint-400 text-base-950' : 'border border-base-700 bg-base-850 text-base-100'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-base-700 bg-base-850 px-4 py-2.5 text-sm text-base-400">
              <Loader2 size={14} className="animate-spin" /> Pensando...
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-ember-400/30 bg-ember-500/10 px-4 py-2.5 text-sm text-ember-300">
            <AlertTriangle size={14} className="shrink-0" /> {error}
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
