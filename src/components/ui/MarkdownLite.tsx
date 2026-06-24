import type { ReactNode } from 'react';

interface MarkdownLiteProps {
  text: string;
  className?: string;
}

// Parser minimalista, propositalmente sem dependências externas.
// Suporta: **negrito**, `código inline`, blocos ```lang\n...\n```, listas com "- ".
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(
        <strong key={key++} className="font-semibold text-base-50">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={key++} className="rounded bg-base-700 px-1.5 py-0.5 font-mono text-[0.85em] text-mint-300">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function MarkdownLite({ text, className = '' }: MarkdownLiteProps) {
  const blocks: ReactNode[] = [];
  const lines = text.split('\n');
  let i = 0;
  let key = 0;
  let listBuffer: string[] = [];

  function flushList() {
    if (listBuffer.length > 0) {
      blocks.push(
        <ul key={key++} className="my-3 space-y-1.5 pl-1">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-base-100">
              <span className="mt-1 text-mint-400">›</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      flushList();
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push(
        <pre key={key++} className="my-3 overflow-x-auto rounded-xl border border-base-700 bg-base-900 p-4">
          {lang && <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-base-400">{lang}</div>}
          <code className="font-mono text-[13px] leading-relaxed text-mint-200">{codeLines.join('\n')}</code>
        </pre>
      );
      i++;
      continue;
    }

    if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2));
      i++;
      continue;
    }

    flushList();

    if (line.trim() === '') {
      i++;
      continue;
    }

    blocks.push(
      <p key={key++} className="text-base-100">
        {renderInline(line)}
      </p>
    );
    i++;
  }
  flushList();

  return <div className={`space-y-3 leading-relaxed ${className}`}>{blocks}</div>;
}
