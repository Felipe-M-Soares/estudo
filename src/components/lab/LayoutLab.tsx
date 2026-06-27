import { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Sparkles, Target, CheckCircle2, ListChecks, Wand2 } from 'lucide-react';

interface Preset {
  label: string;
  group: string;
  css: string;
}

const PRESETS: Preset[] = [
  {
    label: 'Flexbox — centralizar',
    group: 'Flexbox',
    css: `.caixa {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-direction: row;
}`,
  },
  {
    label: 'Flexbox — espaçar nas pontas',
    group: 'Flexbox',
    css: `.caixa {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}`,
  },
  {
    label: 'Flexbox — quebrar linha (wrap)',
    group: 'Flexbox',
    css: `.caixa {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 260px;
}
.item {
  width: 70px;
}`,
  },
  {
    label: 'Flexbox — coluna',
    group: 'Flexbox',
    css: `.caixa {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}`,
  },
  {
    label: 'Grid — 3 colunas',
    group: 'Grid',
    css: `.caixa {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}`,
  },
  {
    label: 'Grid — colunas desiguais',
    group: 'Grid',
    css: `.caixa {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;
}`,
  },
  {
    label: 'Grid — auto-fit responsivo',
    group: 'Grid',
    css: `.caixa {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 8px;
}`,
  },
  {
    label: 'Position — sobrepor com absolute',
    group: 'Position',
    css: `.caixa {
  position: relative;
  height: 160px;
}
.item {
  position: absolute;
}
.item:nth-child(1) { top: 10px; left: 10px; }
.item:nth-child(2) { top: 40px; left: 40px; }
.item:nth-child(3) { top: 70px; left: 70px; }
.item:nth-child(4) { top: 100px; left: 100px; }`,
  },
  {
    label: 'Cores e bordas',
    group: 'Visual',
    css: `.caixa {
  display: flex;
  gap: 10px;
}
.item {
  background: #00ffc2;
  border-radius: 16px;
  border: 2px solid white;
}`,
  },
  {
    label: 'Transição suave no hover',
    group: 'Visual',
    css: `.caixa {
  display: flex;
  gap: 12px;
}
.item {
  transition: transform 0.2s ease, background 0.2s ease;
}
.item:hover {
  transform: translateY(-8px) scale(1.08);
  background: #ff2e9e;
}`,
  },
  {
    label: 'Box Model — padding, border e margin',
    group: 'Box Model',
    css: `.caixa {
  display: flex;
  gap: 16px;
}
.item {
  box-sizing: border-box;
  width: 70px;
  height: 70px;
  padding: 8px;
  border: 4px solid #1ee6ff;
  margin: 6px;
}`,
  },
  {
    label: 'Variáveis CSS — tema com :root',
    group: 'Variáveis CSS',
    css: `.caixa {
  --cor-principal: #00ffc2;
  --espaco: 14px;
  display: flex;
  gap: var(--espaco);
}
.item {
  background: var(--cor-principal);
  border-radius: 10px;
}`,
  },
  {
    label: 'Pseudo-classes — primeiro e último filho',
    group: 'Pseudo-classes',
    css: `.caixa {
  display: flex;
  gap: 8px;
}
.item:first-child {
  background: #1ee6ff;
}
.item:last-child {
  background: #ff2e9e;
}
.item:nth-child(odd) {
  border-radius: 50%;
}`,
  },
];

const GROUPS = Array.from(new Set(PRESETS.map((p) => p.group)));

interface Challenge {
  id: string;
  title: string;
  goal: string;
  hint: string;
  startCss: string;
  check: (css: string) => boolean;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'centralizar',
    title: 'Centralize a caixa',
    goal: 'Use display: flex e centralize os itens nos dois eixos (horizontal e vertical).',
    hint: 'Você vai precisar de display: flex, justify-content: center e align-items: center.',
    startCss: `.caixa {
  display: block;
}`,
    check: (css) => /display:\s*flex/i.test(css) && /justify-content:\s*center/i.test(css) && /align-items:\s*center/i.test(css),
  },
  {
    id: 'grid3',
    title: 'Monte uma grade de 3 colunas',
    goal: 'Use display: grid com exatamente 3 colunas de mesmo tamanho.',
    hint: 'grid-template-columns: repeat(3, 1fr) faz 3 colunas iguais.',
    startCss: `.caixa {
  display: flex;
}`,
    check: (css) => /display:\s*grid/i.test(css) && /repeat\(\s*3\s*,/i.test(css),
  },
  {
    id: 'espacar',
    title: 'Distribua os itens nas pontas',
    goal: 'Use flexbox para que o primeiro item fique na ponta esquerda e o último na ponta direita.',
    hint: 'justify-content: space-between distribui o espaço entre os itens.',
    startCss: `.caixa {
  display: flex;
  justify-content: center;
}`,
    check: (css) => /display:\s*flex/i.test(css) && /justify-content:\s*space-between/i.test(css),
  },
  {
    id: 'coluna',
    title: 'Empilhe os itens verticalmente',
    goal: 'Faça os itens ficarem um abaixo do outro, com algum espaço (gap) entre eles.',
    hint: 'flex-direction: column muda o eixo principal do flex para vertical.',
    startCss: `.caixa {
  display: flex;
  flex-direction: row;
}`,
    check: (css) => /display:\s*flex/i.test(css) && /flex-direction:\s*column/i.test(css) && /gap:/i.test(css),
  },
  {
    id: 'absoluto',
    title: 'Sobreponha os itens com position',
    goal: 'Use position: relative na caixa e position: absolute nos itens para fazer eles se sobreporem.',
    hint: 'O container precisa de position: relative; os itens, position: absolute, com top/left diferentes.',
    startCss: `.caixa {
  display: flex;
}`,
    check: (css) => /\.caixa\s*\{[^}]*position:\s*relative/i.test(css) && /\.item[^{]*\{[^}]*position:\s*absolute/i.test(css),
  },
  {
    id: 'box-model',
    title: 'Domine o Box Model',
    goal: 'Dê a cada item um padding de pelo menos 8px e uma borda visível (border), mantendo box-sizing: border-box para o tamanho não "explodir".',
    hint: 'box-sizing: border-box faz o padding e a borda ficarem DENTRO do width/height definido, em vez de somar a ele.',
    startCss: `.item {
  width: 60px;
  height: 60px;
}`,
    check: (css) => /\.item[^{]*\{[^}]*box-sizing:\s*border-box/i.test(css) && /padding:\s*([89]|1[0-9])px/i.test(css) && /border:\s*\d/i.test(css),
  },
  {
    id: 'variavel-css',
    title: 'Crie uma variável CSS reutilizável',
    goal: 'Declare uma variável (ex: --cor-principal) dentro de .caixa e use ela com var(...) para colorir o background dos itens.',
    hint: 'Uma variável CSS se declara como --nome: valor; e se usa como var(--nome).',
    startCss: `.caixa {
  display: flex;
  gap: 10px;
}
.item {
  background: gray;
}`,
    check: (css) => /--[\w-]+\s*:/i.test(css) && /var\(\s*--[\w-]+/i.test(css),
  },
  {
    id: 'pseudo-classe',
    title: 'Destaque o primeiro item com pseudo-classe',
    goal: 'Sem adicionar nenhuma classe nova no HTML, faça o primeiro item da caixa ficar com uma cor diferente dos outros, usando uma pseudo-classe.',
    hint: ':first-child seleciona o primeiro elemento dentro do pai, sem precisar de uma classe extra.',
    startCss: `.caixa {
  display: flex;
  gap: 10px;
}`,
    check: (css) => /\.item:first-child\s*\{[^}]*background/i.test(css),
  },
];

const DEFAULT_CSS = PRESETS[0].css;

type SubTab = 'livre' | 'desafio';

export function LayoutLab() {
  const [subTab, setSubTab] = useState<SubTab>('livre');
  const [css, setCss] = useState(DEFAULT_CSS);
  const [itemCount, setItemCount] = useState(4);
  const [darkPreview, setDarkPreview] = useState(true);
  const [activeChallenge, setActiveChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [challengeCss, setChallengeCss] = useState(CHALLENGES[0].startCss);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [justSolved, setJustSolved] = useState(false);

  function applyPreset(presetCss: string) {
    setCss(presetCss);
  }

  function reset() {
    setCss(DEFAULT_CSS);
    setItemCount(4);
  }

  function pickChallenge(c: Challenge) {
    setActiveChallenge(c);
    setChallengeCss(c.startCss);
    setJustSolved(false);
  }

  const isSolved = useMemo(() => activeChallenge.check(challengeCss), [activeChallenge, challengeCss]);

  useEffect(() => {
    if (isSolved && !solved.has(activeChallenge.id)) {
      setSolved((prev) => new Set(prev).add(activeChallenge.id));
      setJustSolved(true);
    }
  }, [isSolved, activeChallenge.id, solved]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-1.5">
        <button
          onClick={() => setSubTab('livre')}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
            subTab === 'livre' ? 'bg-cyan-400 text-base-950' : 'bg-base-800 text-base-300'
          }`}
        >
          <Wand2 size={12} /> Modo livre
        </button>
        <button
          onClick={() => setSubTab('desafio')}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
            subTab === 'desafio' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'
          }`}
        >
          <Target size={12} /> Modo desafio {solved.size > 0 && `(${solved.size}/${CHALLENGES.length})`}
        </button>
      </div>

      {subTab === 'livre' && (
        <>
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-2.5 text-sm text-base-200">
            ✏️ Edite o CSS abaixo e veja a área de preview mudar em tempo real. Tente trocar <code className="text-mint-300">flex</code> por{' '}
            <code className="text-mint-300">grid</code>, mudar cores, posições, ou os valores de <code className="text-mint-300">gap</code>.
          </div>

          <div className="space-y-2">
            {GROUPS.map((group) => (
              <div key={group} className="flex flex-wrap items-center gap-2">
                <span className="w-24 shrink-0 text-xs text-base-400">{group}:</span>
                {PRESETS.filter((p) => p.group === group).map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.css)}
                    className={`rounded-full border px-3 py-1 text-xs hover:bg-base-800 ${
                      css === p.css ? 'border-cyan-400/60 bg-cyan-500/10 text-base-50' : 'border-base-600 text-base-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            ))}
            <div className="flex justify-end">
              <button onClick={reset} className="flex items-center gap-1 rounded-full border border-base-600 px-3 py-1 text-xs text-base-300 hover:bg-base-800">
                <RotateCcw size={11} /> Resetar
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">Seu CSS</p>
              <textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                spellCheck={false}
                rows={16}
                className="w-full resize-none rounded-xl border border-base-700 bg-base-950/80 p-3 font-mono text-[13px] text-mint-200 outline-none focus:border-cyan-400/60"
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-base-400">Itens na caixa:</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value))}
                  className="flex-1 accent-cyan-400"
                />
                <span className="mono-num text-[11px] text-base-200">{itemCount}</span>
              </div>
              <label className="mt-2 flex items-center gap-2 text-[11px] text-base-400">
                <input type="checkbox" checked={darkPreview} onChange={(e) => setDarkPreview(e.target.checked)} className="accent-cyan-400" />
                Fundo escuro no preview (desmarque para ver melhor cores claras)
              </label>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">Preview ao vivo</p>
              <div
                className={`rounded-xl border border-base-700 p-4 ${darkPreview ? 'bg-base-950/40' : 'bg-base-100'}`}
                style={{ minHeight: '280px', overflow: 'hidden' }}
              >
                <style>{css}</style>
                <div className="caixa">
                  {Array.from({ length: itemCount }, (_, i) => (
                    <div
                      key={i}
                      className="item flex h-14 w-14 shrink-0 items-center justify-center bg-base-700 font-mono text-xs text-base-50"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-2 flex items-center gap-1 text-[11px] text-base-500">
                <Sparkles size={11} /> A área de preview tem as classes "caixa" (no container) e "item" (em cada quadrado) — seu CSS controla os dois.
              </p>
            </div>
          </div>
        </>
      )}

      {subTab === 'desafio' && (
        <>
          <div className="rounded-xl border border-mint-400/20 bg-mint-900/10 px-4 py-2.5 text-sm text-base-200">
            🎯 Escolha um desafio, escreva o CSS necessário e o preview avisa automaticamente quando você acertar. Sem gabarito visível —
            só a dica, se precisar.
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CHALLENGES.map((c) => (
              <button
                key={c.id}
                onClick={() => pickChallenge(c)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  activeChallenge.id === c.id ? 'border-mint-400/60 bg-mint-400/10 text-base-50' : 'border-base-600 text-base-300 hover:bg-base-800'
                }`}
              >
                {solved.has(c.id) && <CheckCircle2 size={12} className="text-mint-400" />}
                {c.title}
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-2 flex items-start gap-2 rounded-xl border border-base-700 bg-base-900/60 p-3">
                <ListChecks size={15} className="mt-0.5 shrink-0 text-amber-300" />
                <div>
                  <p className="text-sm font-semibold text-base-50">{activeChallenge.title}</p>
                  <p className="mt-1 text-[12.5px] text-base-300">{activeChallenge.goal}</p>
                </div>
              </div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">Seu CSS</p>
              <textarea
                value={challengeCss}
                onChange={(e) => {
                  setChallengeCss(e.target.value);
                  setJustSolved(false);
                }}
                spellCheck={false}
                rows={11}
                className="w-full resize-none rounded-xl border border-base-700 bg-base-950/80 p-3 font-mono text-[13px] text-mint-200 outline-none focus:border-mint-400/60"
              />
              <details className="mt-2 text-[12px] text-amber-300">
                <summary className="cursor-pointer select-none">Ver dica</summary>
                <p className="mt-1 text-base-300">{activeChallenge.hint}</p>
              </details>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">Preview</p>
              <div className="rounded-xl border border-base-700 bg-base-950/40 p-4" style={{ minHeight: '240px', overflow: 'hidden' }}>
                <style>{challengeCss}</style>
                <div className="caixa">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="item flex h-14 w-14 shrink-0 items-center justify-center bg-base-700 font-mono text-xs text-base-50">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              {isSolved ? (
                <div
                  className={`mt-3 flex items-center gap-2 rounded-lg border p-3 text-sm ${
                    justSolved ? 'animate-rise-in' : ''
                  } border-mint-400/30 bg-mint-900/15 text-mint-200`}
                >
                  <CheckCircle2 size={16} /> Desafio resolvido! Pode tentar outro acima.
                </div>
              ) : (
                <p className="mt-3 text-[11px] text-base-500">Escreva o CSS no campo à esquerda — o resultado é verificado automaticamente.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
