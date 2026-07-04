import { useRef, useState } from 'react';
import { AlertTriangle, Download, Upload, CheckCircle2, Palette, Trash2 } from 'lucide-react';
import type { UserProgress } from '../data/types';
import { useDesignTheme, type DesignThemeId } from '../hooks/useDesignTheme';

interface SettingsPageProps {
  onResetProgress: () => void;
  progress: UserProgress;
  profileName: string;
  onImportProgress: (data: UserProgress) => void;
}

export function SettingsPage({
  onResetProgress,
  progress,
  profileName,
  onImportProgress,
}: SettingsPageProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { theme, setTheme, themes } = useDesignTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateLabel = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `devjourney-backup-${profileName.toLowerCase().replace(/\s+/g, '-')}-${dateLabel}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (typeof parsed !== 'object' || parsed === null || !('xp' in parsed)) {
          throw new Error('Formato inválido');
        }
        onImportProgress(parsed as UserProgress);
        setImportStatus('success');
      } catch {
        setImportStatus('error');
      }
      setTimeout(() => setImportStatus('idle'), 2500);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8 lg:px-8">
      <div className="mb-6 animate-rise-in">
        <p className="font-mono text-xs uppercase tracking-widest text-base-400">Preferências</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-base-50">Configurações</h1>
      </div>


      <section className="mb-6 rounded-2xl glass-panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-300 to-cyan-400 text-base-950">
            <Palette size={18} />
          </span>
          <div>
            <h2 className="font-display text-base font-bold text-base-50">Temas visuais</h2>
            <p className="text-sm text-base-400">Escolha a identidade do app: gamer neon, premium ou foco leitura.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(themes) as DesignThemeId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={`rounded-2xl border p-3 text-left transition-all ${
                theme === id ? 'border-mint-400 bg-mint-400/10 shadow-[0_0_28px_-18px_theme(colors.mint.400)]' : 'border-base-700 bg-base-900/55 hover:border-base-500'
              }`}
            >
              <span className={`mb-3 block h-10 rounded-xl bg-gradient-to-r ${themes[id].preview}`} />
              <span className="block font-display text-sm font-bold text-base-50">{themes[id].name}</span>
              <span className="mt-1 block text-xs leading-relaxed text-base-400">{themes[id].tagline}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-ember-400/30 bg-ember-500/5 p-5">
        <h2 className="flex items-center gap-1.5 font-display text-base font-bold text-ember-300">
          <AlertTriangle size={16} /> Sobre publicar este projeto no GitHub
        </h2>
        <p className="mt-1.5 text-sm text-base-200">
          O fluxo de IA foi removido do produto principal. Ainda assim, nunca publique segredos como `TOKEN_SECRET`,
          `ADMIN_TOKEN`, tokens de pagamento ou arquivos `.env` em repositórios públicos.
        </p>
      </section>

      <section className="mb-6 rounded-2xl card-surface p-5">
        <h2 className="font-display text-base font-bold text-base-50">💾 Backup do seu progresso</h2>
        <p className="mt-1.5 text-sm text-base-300">
          Seu progresso fica só neste navegador — se você limpar os dados ou trocar de computador, ele se perde. Exporte um
          arquivo de backup periodicamente, ou antes de fazer qualquer mudança grande no navegador.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-bold text-base-950 hover:opacity-90"
          >
            <Download size={14} /> Exportar backup
          </button>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-1.5 rounded-lg border border-base-600 px-4 py-2.5 text-sm font-semibold text-base-200 hover:bg-base-800"
          >
            <Upload size={14} /> Importar backup
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} className="hidden" />
        </div>
        {importStatus === 'success' && (
          <p className="mt-2.5 flex items-center gap-1.5 text-sm text-mint-300">
            <CheckCircle2 size={14} /> Backup importado com sucesso!
          </p>
        )}
        {importStatus === 'error' && (
          <p className="mt-2.5 flex items-center gap-1.5 text-sm text-ember-400">
            <AlertTriangle size={14} /> Esse arquivo não parece um backup válido do DevJourney.
          </p>
        )}
        <p className="mt-3 text-[11px] text-base-500">
          Importar substitui o progresso atual deste perfil pelo conteúdo do arquivo — exporte um backup antes, se quiser
          poder voltar atrás.
        </p>
      </section>

      <section className="rounded-2xl card-surface p-5">
        <h2 className="font-display text-base font-bold text-base-50">Dados locais</h2>
        <p className="mt-1.5 text-sm text-base-300">
          Todo seu progresso (XP, checklist, exercícios) fica salvo no localStorage deste navegador. Limpar os dados do
          navegador apaga esse progresso — não há sincronização com a nuvem.
        </p>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="mt-3 flex items-center gap-1.5 rounded-lg border border-ember-400/40 px-4 py-2 text-sm font-semibold text-ember-300 hover:bg-ember-500/10"
          >
            <Trash2 size={14} /> Resetar todo o progresso
          </button>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-ember-300">Tem certeza? Isso não pode ser desfeito.</span>
            <button
              onClick={() => { onResetProgress(); setConfirmReset(false); }}
              className="rounded-lg bg-ember-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Sim, resetar
            </button>
            <button onClick={() => setConfirmReset(false)} className="rounded-lg border border-base-600 px-3 py-1.5 text-xs text-base-300">
              Cancelar
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
