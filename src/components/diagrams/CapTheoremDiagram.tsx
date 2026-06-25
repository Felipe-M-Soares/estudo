import { useState } from 'react';

type Choice = 'CA' | 'CP' | 'AP';

const explanations: Record<Choice, { title: string; text: string; example: string }> = {
  CA: {
    title: 'Consistência + Disponibilidade',
    text: 'Sempre responde, e sempre com o dado mais atual. Só é possível sem partição de rede — ou seja, na prática, dentro de uma única máquina/data center.',
    example: 'Banco de dados relacional tradicional, rodando em um único servidor.',
  },
  CP: {
    title: 'Consistência + Tolerância a Partição',
    text: 'Durante uma falha de rede, o sistema prefere recusar responder do que arriscar devolver um dado desatualizado.',
    example: 'Sistemas bancários: melhor recusar a transação do que processar com saldo errado.',
  },
  AP: {
    title: 'Disponibilidade + Tolerância a Partição',
    text: 'Durante uma falha de rede, o sistema continua respondendo, mesmo que o dado possa estar levemente desatualizado.',
    example: 'Redes sociais: melhor mostrar uma contagem de likes levemente atrasada do que travar a tela.',
  },
};

export function CapTheoremDiagram() {
  const [selected, setSelected] = useState<Choice>('AP');

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <p className="mb-3 text-center text-xs font-semibold text-base-300">
        Durante uma falha de rede, escolha 2 de 3 propriedades:
      </p>

      <div className="flex justify-center gap-2">
        {(['CA', 'CP', 'AP'] as Choice[]).map((c) => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            className={`rounded-xl px-5 py-3 text-sm font-bold transition-all ${
              selected === c ? 'bg-mint-400 text-base-950 scale-105 shadow-lg' : 'bg-base-800 text-base-300 hover:bg-base-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-base-950/60 p-3">
        <p className="text-sm font-semibold text-mint-300">{explanations[selected].title}</p>
        <p className="mt-1 text-xs text-base-200">{explanations[selected].text}</p>
        <p className="mt-1.5 text-[11px] text-base-400">Exemplo: {explanations[selected].example}</p>
      </div>
    </div>
  );
}
