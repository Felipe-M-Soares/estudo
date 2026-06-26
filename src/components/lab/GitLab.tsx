import { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw, GitCommit, CheckCircle2, ListChecks, BookOpen, Terminal as TerminalIcon } from 'lucide-react';

interface FileState {
  name: string;
  status: 'untracked' | 'staged' | 'committed' | 'modified';
  content: string;
}

interface Commit {
  hash: string;
  message: string;
  files: string[];
  branch: string;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

interface Mission {
  id: string;
  title: string;
  steps: string[];
  check: (state: { files: FileState[]; commits: Commit[]; branches: string[]; branch: string; history: TerminalLine[] }) => boolean;
}

function randomHash(): string {
  return Math.random().toString(16).slice(2, 9);
}

const MISSIONS: Mission[] = [
  {
    id: 'primeiro-commit',
    title: 'Seu primeiro commit',
    steps: [
      'Crie um arquivo chamado index.js na lista ao lado',
      'No terminal, rode: git add index.js',
      'Depois rode: git commit -m "primeiro commit"',
    ],
    check: (s) => s.commits.length >= 1,
  },
  {
    id: 'nova-branch',
    title: 'Trabalhe em uma branch separada',
    steps: [
      'Rode: git branch feature-login',
      'Rode: git checkout feature-login',
      'Confirme com git status que você está na nova branch',
    ],
    check: (s) => s.branches.includes('feature-login') && s.branch === 'feature-login',
  },
  {
    id: 'gitignore',
    title: 'Ignore arquivos sensíveis',
    steps: [
      'Crie um arquivo chamado .env',
      'Crie um arquivo chamado .gitignore',
      'Edite o conteúdo do .gitignore (clique no arquivo) e escreva ".env" dentro',
      'Rode git status — o .env não deve mais aparecer como untracked',
    ],
    check: (s) => {
      const gitignore = s.files.find((f) => f.name === '.gitignore');
      const hasEnv = s.files.some((f) => f.name === '.env');
      return !!gitignore && hasEnv && gitignore.content.includes('.env');
    },
  },
  {
    id: 'merge',
    title: 'Faça um merge entre branches',
    steps: [
      'Crie uma branch nova e mude para ela',
      'Crie um arquivo, adicione e comite nessa branch',
      'Volte para a main com git checkout main',
      'Rode: git merge <nome-da-branch>',
    ],
    check: (s) => s.history.some((l) => l.type === 'success' && /merge/i.test(l.text)),
  },
];

const INITIAL_FILES: FileState[] = [];

export function GitLab() {
  const [files, setFiles] = useState<FileState[]>(INITIAL_FILES);
  const [branch, setBranch] = useState('main');
  const [branches, setBranches] = useState(['main']);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [stash, setStash] = useState<FileState[] | null>(null);
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', text: 'Bem-vindo ao terminal Git simulado. Digite "ajuda" para ver os comandos disponíveis.' },
  ]);
  const [input, setInput] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [showMissions, setShowMissions] = useState(true);
  const [activeMission, setActiveMission] = useState<Mission>(MISSIONS[0]);
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    const ok = activeMission.check({ files, commits, branches, branch, history });
    if (ok && !completedMissions.has(activeMission.id)) {
      setCompletedMissions((prev) => new Set(prev).add(activeMission.id));
    }
  }, [files, commits, branches, branch, history, activeMission, completedMissions]);

  function print(lines: TerminalLine[]) {
    setHistory((prev) => [...prev, ...lines]);
  }

  function createFile() {
    const name = newFileName.trim();
    if (!name) return;
    if (files.some((f) => f.name === name)) return;
    setFiles((prev) => [...prev, { name, status: 'untracked', content: '' }]);
    setNewFileName('');
  }

  function deleteFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  function updateFileContent(name: string, content: string) {
    setFiles((prev) => prev.map((f) => (f.name === name ? { ...f, content, status: f.status === 'committed' ? 'modified' : f.status } : f)));
  }

  function isIgnored(name: string): boolean {
    const gitignore = files.find((f) => f.name === '.gitignore');
    if (!gitignore) return false;
    return gitignore.content
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .some((pattern) => pattern === name);
  }

  function runCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    print([{ type: 'input', text: cmd }]);

    const parts = cmd.split(' ').filter(Boolean);
    const base = parts[0];

    if (base !== 'git' && cmd !== 'ajuda' && cmd !== 'clear') {
      print([{ type: 'error', text: `comando não encontrado: ${base}. Use "git ..." ou digite "ajuda".` }]);
      return;
    }

    if (cmd === 'ajuda') {
      print([
        {
          type: 'output',
          text:
            'Comandos: git status | git add <arquivo|.> | git commit -m "msg" | git branch [nome] | git checkout <nome> | ' +
            'git log [--oneline] | git diff | git merge <branch> | git reset <arquivo> | git stash | git stash pop | clear',
        },
      ]);
      return;
    }

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    const sub = parts[1];
    const visibleFiles = files.filter((f) => !isIgnored(f.name));

    if (sub === 'status') {
      if (visibleFiles.length === 0) {
        print([{ type: 'output', text: `On branch ${branch}\nnenhum arquivo rastreável. Crie um arquivo na lista ao lado.` }]);
        return;
      }
      const lines = visibleFiles.map((f) => ({
        type: 'output' as const,
        text: `  ${f.status === 'staged' ? 'staged: ' : f.status === 'committed' ? 'committed: ' : f.status === 'modified' ? 'modified: ' : 'untracked: '}${f.name}`,
      }));
      print([{ type: 'output', text: `On branch ${branch}` }, ...lines]);
      return;
    }

    if (sub === 'diff') {
      const modified = files.filter((f) => f.status === 'modified');
      if (modified.length === 0) {
        print([{ type: 'output', text: 'nenhuma alteração não-comitada para mostrar.' }]);
        return;
      }
      const lines = modified.map((f) => ({ type: 'output' as const, text: `diff --git a/${f.name} b/${f.name}\n+ ${f.content || '(vazio)'}` }));
      print(lines);
      return;
    }

    if (sub === 'add') {
      const target = parts[2];
      if (!target) {
        print([{ type: 'error', text: 'uso: git add <arquivo> ou git add .' }]);
        return;
      }
      if (target === '.') {
        const ignoredCount = files.filter((f) => isIgnored(f.name) && f.status === 'untracked').length;
        setFiles((prev) =>
          prev.map((f) => ((f.status === 'untracked' || f.status === 'modified') && !isIgnored(f.name) ? { ...f, status: 'staged' } : f))
        );
        print([
          { type: 'success', text: 'todos os arquivos rastreáveis foram adicionados à staging area.' },
          ...(ignoredCount > 0 ? [{ type: 'output' as const, text: `(${ignoredCount} arquivo(s) ignorado(s) pelo .gitignore não foram adicionados)` }] : []),
        ]);
        return;
      }
      const exists = files.find((f) => f.name === target);
      if (!exists) {
        print([{ type: 'error', text: `arquivo "${target}" não existe. Crie ele na lista ao lado primeiro.` }]);
        return;
      }
      if (isIgnored(target)) {
        print([{ type: 'error', text: `"${target}" está no .gitignore — o Git nunca vai rastrear esse arquivo.` }]);
        return;
      }
      setFiles((prev) => prev.map((f) => (f.name === target ? { ...f, status: 'staged' } : f)));
      print([{ type: 'success', text: `"${target}" adicionado à staging area.` }]);
      return;
    }

    if (sub === 'reset') {
      const target = parts[2];
      if (!target) {
        print([{ type: 'error', text: 'uso: git reset <arquivo> — remove o arquivo da staging area.' }]);
        return;
      }
      const exists = files.find((f) => f.name === target);
      if (!exists) {
        print([{ type: 'error', text: `arquivo "${target}" não existe.` }]);
        return;
      }
      setFiles((prev) => prev.map((f) => (f.name === target && f.status === 'staged' ? { ...f, status: 'untracked' } : f)));
      print([{ type: 'output', text: `"${target}" removido da staging area (continua com as alterações no arquivo).` }]);
      return;
    }

    if (sub === 'commit') {
      const messageMatch = cmd.match(/-m\s+"([^"]+)"/);
      if (!messageMatch) {
        print([{ type: 'error', text: 'uso: git commit -m "sua mensagem"' }]);
        return;
      }
      const staged = files.filter((f) => f.status === 'staged');
      if (staged.length === 0) {
        print([{ type: 'error', text: 'nada para commitar — use "git add" primeiro.' }]);
        return;
      }
      const hash = randomHash();
      setCommits((prev) => [...prev, { hash, message: messageMatch[1], files: staged.map((f) => f.name), branch }]);
      setFiles((prev) => prev.map((f) => (f.status === 'staged' ? { ...f, status: 'committed' } : f)));
      print([{ type: 'success', text: `[${branch} ${hash}] ${messageMatch[1]} — ${staged.length} arquivo(s) alterado(s)` }]);
      return;
    }

    if (sub === 'log') {
      const oneline = parts[2] === '--oneline';
      if (commits.length === 0) {
        print([{ type: 'output', text: 'nenhum commit ainda.' }]);
        return;
      }
      const relevant = commits.filter((c) => c.branch === branch || c.branch === 'main');
      const lines = relevant
        .slice()
        .reverse()
        .map((c) => ({
          type: 'output' as const,
          text: oneline ? `${c.hash}  ${c.message}` : `commit ${c.hash}  (${c.branch})\n  ${c.message}\n  arquivos: ${c.files.join(', ')}`,
        }));
      print(lines);
      return;
    }

    if (sub === 'branch') {
      const name = parts[2];
      if (!name) {
        print([{ type: 'output', text: branches.map((b) => (b === branch ? `* ${b}` : `  ${b}`)).join('\n') }]);
        return;
      }
      if (branches.includes(name)) {
        print([{ type: 'error', text: `a branch "${name}" já existe.` }]);
        return;
      }
      setBranches((prev) => [...prev, name]);
      print([{ type: 'success', text: `branch "${name}" criada a partir de "${branch}".` }]);
      return;
    }

    if (sub === 'checkout') {
      const name = parts[2];
      if (!name || !branches.includes(name)) {
        print([{ type: 'error', text: `branch "${name}" não existe. Use "git branch <nome>" para criar.` }]);
        return;
      }
      setBranch(name);
      print([{ type: 'success', text: `Switched to branch '${name}'` }]);
      return;
    }

    if (sub === 'merge') {
      const name = parts[2];
      if (!name) {
        print([{ type: 'error', text: 'uso: git merge <nome-da-branch>' }]);
        return;
      }
      if (!branches.includes(name)) {
        print([{ type: 'error', text: `branch "${name}" não existe.` }]);
        return;
      }
      if (name === branch) {
        print([{ type: 'error', text: 'você não pode fazer merge de uma branch com ela mesma.' }]);
        return;
      }
      const incoming = commits.filter((c) => c.branch === name);
      if (incoming.length === 0) {
        print([{ type: 'output', text: `"${name}" não tem commits próprios — já está tudo atualizado.` }]);
        return;
      }
      setCommits((prev) => [...prev, ...incoming.map((c) => ({ ...c, branch }))]);
      print([{ type: 'success', text: `Merge feito: ${incoming.length} commit(s) de "${name}" trazidos para "${branch}".` }]);
      return;
    }

    if (sub === 'stash') {
      const action = parts[2];
      if (action === 'pop') {
        if (!stash) {
          print([{ type: 'error', text: 'não há nada no stash.' }]);
          return;
        }
        setFiles(stash);
        setStash(null);
        print([{ type: 'success', text: 'alterações restauradas do stash.' }]);
        return;
      }
      const dirty = files.filter((f) => f.status === 'modified' || f.status === 'staged');
      if (dirty.length === 0) {
        print([{ type: 'output', text: 'nenhuma alteração para guardar no stash.' }]);
        return;
      }
      setStash(files);
      setFiles((prev) => prev.map((f) => (f.status === 'modified' || f.status === 'staged' ? { ...f, status: 'committed' as const } : f)));
      print([{ type: 'success', text: `${dirty.length} alteração(ões) guardadas no stash. Use "git stash pop" para trazer de volta.` }]);
      return;
    }

    print([{ type: 'error', text: `comando git desconhecido: "${sub}". Digite "ajuda" para ver os comandos.` }]);
  }

  function reset() {
    setFiles([]);
    setBranch('main');
    setBranches(['main']);
    setCommits([]);
    setStash(null);
    setHistory([{ type: 'output', text: 'Repositório resetado. Digite "ajuda" para começar de novo.' }]);
  }

  const branchGraph = useMemo(() => {
    return branches.map((b) => ({
      name: b,
      commitCount: commits.filter((c) => c.branch === b).length,
      isCurrent: b === branch,
    }));
  }, [branches, commits, branch]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-2.5 text-sm text-base-200">
        🗂️ Crie arquivos na lista ao lado, depois use o terminal pra rodar comandos Git reais — <code className="text-mint-300">git add</code>,{' '}
        <code className="text-mint-300">git commit</code>, <code className="text-mint-300">git branch</code>,{' '}
        <code className="text-mint-300">git merge</code>. É um Git simulado, então nada sai do seu navegador.
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowMissions((v) => !v)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
            showMissions ? 'border-amber-400/50 bg-amber-500/10 text-base-50' : 'border-base-600 text-base-300 hover:bg-base-800'
          }`}
        >
          <BookOpen size={12} /> Missões guiadas {completedMissions.size > 0 && `(${completedMissions.size}/${MISSIONS.length})`}
        </button>
      </div>

      {showMissions && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {MISSIONS.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMission(m)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  activeMission.id === m.id ? 'border-amber-400/60 bg-amber-400/10 text-base-50' : 'border-base-600 text-base-300 hover:bg-base-800'
                }`}
              >
                {completedMissions.has(m.id) && <CheckCircle2 size={12} className="text-mint-400" />}
                {m.title}
              </button>
            ))}
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-base-900/50 p-2.5">
            <ListChecks size={14} className="mt-0.5 shrink-0 text-amber-300" />
            <ol className="list-decimal space-y-0.5 pl-4 text-[12.5px] text-base-300">
              {activeMission.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
          {completedMissions.has(activeMission.id) && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-mint-300">
              <CheckCircle2 size={13} /> Missão concluída!
            </p>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3">
          <div className="rounded-xl border border-base-700 bg-base-900/60 p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">Arquivos do projeto</p>
            <div className="flex gap-1.5">
              <input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createFile()}
                placeholder="ex: index.js"
                className="flex-1 rounded-lg border border-base-600 bg-base-800 px-2.5 py-1.5 text-xs text-base-100 outline-none focus:border-cyan-400"
              />
              <button onClick={createFile} className="rounded-lg bg-mint-400 px-3 py-1.5 text-xs font-bold text-base-950">
                Criar
              </button>
            </div>
            <div className="mt-2 space-y-1">
              {files.length === 0 && <p className="text-[11px] text-base-500">Nenhum arquivo ainda.</p>}
              {files.map((f) => {
                const ignored = isIgnored(f.name);
                return (
                  <div key={f.name} className="rounded-lg bg-base-800/60 px-2.5 py-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setEditingFile(editingFile === f.name ? null : f.name)}
                        className="font-mono text-base-100 hover:text-cyan-300"
                      >
                        {f.name}
                      </button>
                      <div className="flex items-center gap-2">
                        {ignored && <span className="rounded-full bg-base-700 px-2 py-0.5 text-[10px] text-base-400">ignorado</span>}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            f.status === 'committed'
                              ? 'bg-mint-900/40 text-mint-300'
                              : f.status === 'staged'
                              ? 'bg-amber-500/15 text-amber-300'
                              : f.status === 'modified'
                              ? 'bg-cyan-500/15 text-cyan-300'
                              : 'bg-base-700 text-base-400'
                          }`}
                        >
                          {f.status}
                        </span>
                        <button onClick={() => deleteFile(f.name)} className="text-base-500 hover:text-ember-400">
                          ✕
                        </button>
                      </div>
                    </div>
                    {editingFile === f.name && (
                      <textarea
                        value={f.content}
                        onChange={(e) => updateFileContent(f.name, e.target.value)}
                        placeholder="conteúdo do arquivo..."
                        rows={3}
                        spellCheck={false}
                        className="mt-1.5 w-full resize-none rounded-lg border border-base-600 bg-base-950 p-2 font-mono text-[11px] text-base-200 outline-none focus:border-cyan-400"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-base-700 bg-base-900/60 p-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">Branches</p>
            <div className="space-y-1.5">
              {branchGraph.map((b) => (
                <div key={b.name} className="flex items-center gap-2">
                  <span className={`flex h-2 w-2 shrink-0 rounded-full ${b.isCurrent ? 'bg-cyan-400' : 'bg-base-600'}`} />
                  <span className={`font-mono text-sm ${b.isCurrent ? 'text-cyan-300' : 'text-base-300'}`}>{b.name}</span>
                  <span className="text-[10px] text-base-500">{b.commitCount} commit(s)</span>
                </div>
              ))}
            </div>
            {stash && <p className="mt-2 flex items-center gap-1 text-[11px] text-amber-300"><GitCommit size={11} /> 1 stash guardado</p>}
          </div>

          <button onClick={reset} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-base-600 px-3 py-2 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={12} /> Resetar repositório
          </button>
        </div>

        <div className="flex flex-col rounded-xl border border-base-700 bg-base-950 p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">
            <TerminalIcon size={12} /> Terminal
          </p>
          <div className="mb-2 flex-1 space-y-1 overflow-y-auto font-mono text-[12.5px]" style={{ maxHeight: '320px', minHeight: '220px' }}>
            {history.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === 'input'
                    ? 'text-mint-300'
                    : line.type === 'error'
                    ? 'whitespace-pre-wrap text-ember-400'
                    : line.type === 'success'
                    ? 'whitespace-pre-wrap text-cyan-300'
                    : 'whitespace-pre-wrap text-base-300'
                }
              >
                {line.type === 'input' ? `$ ${line.text}` : line.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="flex items-center gap-2 border-t border-base-700 pt-2">
            <span className="font-mono text-xs text-mint-400">$</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  runCommand(input);
                  setInput('');
                }
              }}
              placeholder='git add . / git commit -m "..."'
              spellCheck={false}
              className="flex-1 bg-transparent font-mono text-xs text-base-100 outline-none placeholder:text-base-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
