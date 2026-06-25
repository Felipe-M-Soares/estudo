import { useEffect, useState } from 'react';
import { Plus, Trash2, ExternalLink, Save, FolderGit2 } from 'lucide-react';
import type { ProjectNote } from '../../data/types';

interface ProjectNotesPanelProps {
  moduleId: string;
  existingNote?: ProjectNote;
  onSave: (moduleId: string, text: string, links: { label: string; url: string }[]) => void;
}

export function ProjectNotesPanel({ moduleId, existingNote, onSave }: ProjectNotesPanelProps) {
  const [text, setText] = useState(existingNote?.text ?? '');
  const [links, setLinks] = useState<{ label: string; url: string }[]>(existingNote?.links ?? []);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setText(existingNote?.text ?? '');
    setLinks(existingNote?.links ?? []);
  }, [moduleId, existingNote]);

  function addLink() {
    if (!newUrl.trim()) return;
    const label = newLabel.trim() || 'Repositório';
    setLinks((prev) => [...prev, { label, url: newUrl.trim() }]);
    setNewLabel('');
    setNewUrl('');
  }

  function removeLink(idx: number) {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    onSave(moduleId, text, links);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="card-surface rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300">
          <FolderGit2 size={16} />
        </span>
        <div>
          <h3 className="font-display text-sm font-bold text-base-50">Meu projeto deste módulo</h3>
          <p className="text-xs text-base-400">Guarde aqui o link do repositório e suas próprias notas — fica salvo com seu perfil.</p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Notas sobre esse projeto: decisões que tomou, o que faria diferente, pendências..."
        rows={4}
        className="w-full resize-none rounded-xl border border-base-700 bg-base-950/60 p-3 text-sm text-base-100 outline-none placeholder:text-base-600 focus:border-cyan-400/50"
      />

      <div className="mt-3 space-y-2">
        {links.map((link, idx) => (
          <div key={idx} className="flex items-center gap-2 rounded-lg border border-base-700 bg-base-900/60 px-3 py-2">
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center gap-1.5 truncate text-sm text-cyan-300 hover:underline"
            >
              {link.label} <ExternalLink size={11} className="shrink-0" />
            </a>
            <button onClick={() => removeLink(idx)} className="shrink-0 text-base-500 hover:text-ember-400" aria-label="Remover link">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Nome (ex: GitHub)"
          className="w-32 rounded-lg border border-base-600 bg-base-900 px-2.5 py-1.5 text-xs text-base-100 outline-none focus:border-cyan-400/50"
        />
        <input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addLink()}
          placeholder="https://github.com/voce/projeto"
          className="min-w-[180px] flex-1 rounded-lg border border-base-600 bg-base-900 px-2.5 py-1.5 text-xs text-base-100 outline-none focus:border-cyan-400/50"
        />
        <button onClick={addLink} className="flex items-center gap-1 rounded-lg border border-base-600 px-3 py-1.5 text-xs font-semibold text-base-200 hover:bg-base-800">
          <Plus size={12} /> Adicionar link
        </button>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 flex items-center gap-1.5 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90"
      >
        <Save size={14} /> {saved ? 'Salvo!' : 'Salvar notas'}
      </button>
    </div>
  );
}
