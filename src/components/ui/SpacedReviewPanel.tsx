import { useMemo, useState, Suspense, lazy } from 'react';
import { Brain, ArrowRight } from 'lucide-react';
import { getDueReviews } from '../../data/spacedReview';
import type { SpacedReviewItem } from '../../data/types';

// O conteúdo completo de exercícios/módulos só é necessário quando a sessão de
// revisão é de fato aberta — manter isso como lazy evita que o Dashboard (a
// primeira tela do app) precise carregar todo o conteúdo dos 22 módulos só
// para checar se há algo pendente.
const ReviewSession = lazy(() => import('./ReviewSession').then((m) => ({ default: m.ReviewSession })));

interface SpacedReviewPanelProps {
  spacedReview: Record<string, SpacedReviewItem>;
  onReviewResult: (moduleId: string, exerciseId: string, correct: boolean) => void;
}

export function SpacedReviewPanel({ spacedReview, onReviewResult }: SpacedReviewPanelProps) {
  const dueItems = useMemo(() => getDueReviews(spacedReview), [spacedReview]);
  const [sessionStarted, setSessionStarted] = useState(false);

  if (dueItems.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
            <Brain size={16} />
          </span>
          <div>
            <div className="font-display text-sm font-bold text-base-50">Revisão espaçada</div>
            <div className="text-xs text-base-400">Nada pendente hoje — volte mais tarde.</div>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionStarted) {
    return (
      <div className="card-surface rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300 shadow-[0_0_16px_-4px_theme(colors.violet.400)]">
              <Brain size={16} />
            </span>
            <div>
              <div className="font-display text-sm font-bold text-base-50">Revisão espaçada</div>
              <div className="text-xs text-base-400">
                {dueItems.length} {dueItems.length === 1 ? 'exercício' : 'exercícios'} prontos para revisar
              </div>
            </div>
          </div>
          <button
            onClick={() => setSessionStarted(true)}
            className="flex shrink-0 items-center gap-1 rounded-lg bg-violet-400 px-3 py-2 text-xs font-bold text-base-950 hover:opacity-90"
          >
            Revisar <ArrowRight size={13} />
          </button>
        </div>
        <p className="mt-2.5 text-[11px] text-base-500">
          Esses exercícios já foram resolvidos antes — revisá-los nesse momento certo é o que faz o conhecimento ficar de
          verdade, em vez de esquecer em algumas semanas.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="card-surface rounded-2xl p-5 text-sm text-base-400">Carregando revisão...</div>}>
      <ReviewSession dueItems={dueItems} onReviewResult={onReviewResult} onBack={() => setSessionStarted(false)} />
    </Suspense>
  );
}
