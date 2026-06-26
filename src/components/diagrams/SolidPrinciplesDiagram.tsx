import { useState } from 'react';

const PRINCIPLES = [
  { letter: 'S', name: 'Single Responsibility', desc: 'Uma classe deve ter um único motivo para mudar — uma única responsabilidade.', example: 'Separar "calcular preço" de "salvar no banco" e "enviar email" em classes diferentes.' },
  { letter: 'O', name: 'Open/Closed', desc: 'Deve ser possível estender o comportamento sem modificar o código existente.', example: 'Adicionar um novo tipo de desconto criando uma nova classe, sem editar a lógica de cálculo já existente.' },
  { letter: 'L', name: 'Liskov Substitution', desc: 'Uma subclasse deve poder substituir sua classe-base sem quebrar o comportamento esperado.', example: 'Se Quadrado herda de Retângulo mas trava ao mudar largura/altura independentemente, a herança violou esse princípio.' },
  { letter: 'I', name: 'Interface Segregation', desc: 'Não forçar uma classe a implementar métodos que ela não usa.', example: 'Separar uma interface gigante "Trabalhador" em "Programável" e "ComeAlmoço", já que um robô não almoça.' },
  { letter: 'D', name: 'Dependency Inversion', desc: 'Depender de abstrações, não de implementações concretas.', example: 'Um serviço depender da interface "Repositorio", não diretamente de "PostgresRepositorio".' },
];

export function SolidPrinciplesDiagram() {
  const [selected, setSelected] = useState(0);
  const current = PRINCIPLES[selected];

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        {PRINCIPLES.map((p, i) => (
          <button
            key={p.letter}
            onClick={() => setSelected(i)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-base font-bold transition-all ${
              selected === i ? 'bg-mint-400 text-base-950 scale-110 shadow-[0_0_16px_-2px_theme(colors.mint.400)]' : 'bg-base-800 text-base-300 hover:bg-base-700'
            }`}
          >
            {p.letter}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-base-950/60 p-4">
        <p className="font-display text-sm font-bold text-mint-300">{current.letter} — {current.name}</p>
        <p className="mt-2 text-sm text-base-200">{current.desc}</p>
        <div className="mt-2 rounded-lg border border-base-700 bg-base-900/60 p-2.5 text-xs text-base-300">
          <strong className="text-base-100">Exemplo:</strong> {current.example}
        </div>
      </div>
    </div>
  );
}
