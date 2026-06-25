import { useRef, useState } from 'react';
import { Eye, EyeOff, ExternalLink, Trash2, ShieldCheck, AlertTriangle, Download, Upload, CheckCircle2 } from 'lucide-react';
import type { UserProgress } from '../data/types';

interface SettingsPageProps {
  apiKey: string;
  onSetApiKey: (key: string) => void;
  onClearApiKey: () => void;
  onResetProgress: () => void;
  progress: UserProgress;
  profileName: string;
  onImportProgress: (data: UserProgress) => void;
}

export function SettingsPage({
  apiKey,
  onSetApiKey,
  onClearApiKey,
  onResetProgress,
  progress,
  profileName,
  onImportProgress,
}: SettingsPageProps) {
  const [draft, setDraft] = useState(apiKey);
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    onSetApiKey(draft.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

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
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <div className="mb-6 animate-rise-in">
        <p className="font-mono text-xs uppercase tracking-widest text-base-400">Preferências</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-base-50">Configurações</h1>
      </div>

      <section className="mb-6 rounded-2xl card-surface p-5">
        <h2 className="font-display text-base font-bold text-base-50">🤖 Mentor IA — Chave do Google Gemini (gratuita)</h2>
        <p className="mt-1.5 text-sm text-base-300">
          Sua chave é guardada <strong className="text-base-100">somente no localStorage deste navegador</strong> — ela nunca é
          enviada para nenhum servidor além da API oficial do Google, e nunca aparece no código do projeto que você sobe para
          o GitHub.
        </p>

        <div className="mt-4 rounded-xl border border-mint-400/30 bg-mint-900/15 p-3.5 text-sm text-mint-100">
          <p className="mb-1.5 flex items-center gap-1.5 font-semibold text-mint-300">
            <ShieldCheck size={14} /> Como pegar sua chave (gratuita, sem cartão de crédito)
          </p>
          <ol className="ml-4 list-decimal space-y-1 text-base-200">
            <li>
              Acesse{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-mint-300 underline">
                aistudio.google.com/app/apikey <ExternalLink size={11} />
              </a>
            </li>
            <li>Faça login com uma conta Google (não pede cartão de crédito)</li>
            <li>Clique em "Create API key" e copie a chave gerada</li>
            <li>Cole no campo abaixo e clique em Salvar</li>
          </ol>
          <p className="mt-2 text-[11px] text-base-300">
            O plano gratuito do Gemini tem um limite de mensagens por dia que reseta automaticamente — mais que suficiente
            para conversar com o mentor ao longo dos estudos.
          </p>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold text-base-300">Sua chave de API</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={visible ? 'text' : 'password'}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="AIza..."
                className="w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 pr-10 font-mono text-sm text-base-100 outline-none focus:border-mint-400"
              />
              <button
                onClick={() => setVisible((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-base-400 hover:text-base-100"
                aria-label={visible ? 'Esconder chave' : 'Mostrar chave'}
                type="button"
              >
                {visible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              onClick={handleSave}
              className="shrink-0 rounded-lg bg-mint-400 px-4 py-2.5 text-sm font-semibold text-base-950 hover:opacity-90"
            >
              {saved ? '✓ Salvo' : 'Salvar'}
            </button>
          </div>
          {apiKey && (
            <button onClick={() => { onClearApiKey(); setDraft(''); }} className="mt-2 flex items-center gap-1.5 text-xs text-ember-400 hover:underline">
              <Trash2 size={12} /> Remover chave salva
            </button>
          )}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-ember-400/30 bg-ember-500/5 p-5">
        <h2 className="flex items-center gap-1.5 font-display text-base font-bold text-ember-300">
          <AlertTriangle size={16} /> Sobre publicar este projeto no GitHub
        </h2>
        <p className="mt-1.5 text-sm text-base-200">
          Esta chave fica <strong>apenas no seu navegador</strong> e nunca em nenhum arquivo do projeto — por isso é seguro
          subir todo o código para um repositório público. Mesmo assim, nunca cole sua chave de API diretamente em nenhum
          arquivo de código, commit, ou print de tela que você compartilhe publicamente.
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
