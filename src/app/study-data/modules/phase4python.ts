import type { Module } from '../types';

export const mes20: Module = {
  id: 'mes-20',
  month: 20,
  phase: 4,
  track: 'backend',
  title: 'Python',
  emoji: '🐍',
  tagline: 'A linguagem mais pedida em data, IA e automação.',
  intro:
    'Python é provavelmente a linguagem mais versátil do mercado hoje — domina em ciência de dados, IA/ML, automação, scripts, e tem presença forte em backend também (Django, FastAPI). Você já sabe programar, então esse módulo é mais sobre a sintaxe e os jeitos "pythônicos" de fazer as coisas, não sobre lógica de programação do zero.',
  lessons: [
    {
      id: 'l1',
      heading: 'Sintaxe básica: indentação importa de verdade',
      body:
        'A primeira coisa que choca quem vem de JavaScript ou Java: Python não usa chaves pra delimitar blocos de código, usa **indentação**. Isso não é estilo, é parte da sintaxe — esquecer de indentar certo dá erro de verdade, não só fica "feio".\n\nOutra diferença: não precisa de ponto-e-vírgula no final da linha, e variáveis não têm tipo declarado (mas têm tipo sim, só que o Python descobre sozinho).',
      codeExample: {
        lang: 'python',
        code: 'def saudacao(nome):\n    if nome:\n        return f"Olá, {nome}!"\n    else:\n        return "Olá, visitante!"\n\nprint(saudacao("Ana"))  # Olá, Ana!',
      },
    },
    {
      id: 'l2',
      heading: 'Listas, dicts e tuplas: as estruturas que você vai usar toda hora',
      body:
        '**Lista** (list) é parecida com array do JS — uma coleção ordenada e mutável. **Dict** (dict) é o equivalente a objeto/{{json}} — pares chave-valor. **Tupla** (tuple) é como uma lista, mas **imutável** — uma vez criada, não muda, útil pra representar algo que não deveria mudar nunca (coordenadas, RGB de uma cor).\n\nList comprehension é um dos recursos mais usados (e mais "pythônicos") da linguagem: uma forma compacta de criar uma lista nova a partir de outra, com transformação e filtro num só lugar.',
      codeExample: {
        lang: 'python',
        code: 'numeros = [1, 2, 3, 4, 5, 6]\n\n# Forma "tradicional"\npares = []\nfor n in numeros:\n    if n % 2 == 0:\n        pares.append(n * 2)\n\n# Forma pythônica (list comprehension) — mesma coisa, uma linha\npares = [n * 2 for n in numeros if n % 2 == 0]\nprint(pares)  # [4, 8, 12]',
      },
      diagramId: 'list-comprehension',
    },
    {
      id: 'l3',
      heading: 'Funções: argumentos padrão, *args e **kwargs',
      body:
        'Funções em Python aceitam argumentos com valor padrão direto na assinatura (sem precisar de lógica extra dentro da função). `*args` captura qualquer quantidade de argumentos posicionais extras numa tupla; `**kwargs` captura argumentos nomeados extras num dict — muito usado quando você quer uma função flexível que aceita "o que vier".',
      codeExample: {
        lang: 'python',
        code: 'def criar_usuario(nome, ativo=True, **dados_extra):\n    print(f"{nome}, ativo={ativo}, extra={dados_extra}")\n\ncriar_usuario("Ana", idade=28, cidade="SP")\n# Ana, ativo=True, extra={\'idade\': 28, \'cidade\': \'SP\'}',
      },
    },
    {
      id: 'l4',
      heading: 'Ambientes virtuais e pip: isolando dependências por projeto',
      body:
        'Diferente do Node.js (onde cada projeto já tem sua própria node_modules), Python instala bibliotecas globalmente por padrão — o que vira um problema quando dois projetos precisam de versões diferentes da mesma biblioteca. Um **ambiente virtual** (venv) isola as dependências de cada projeto, exatamente como node_modules faz no mundo JS.\n\n`pip` é o gerenciador de pacotes (equivalente ao npm). A prática padrão: sempre criar e ativar um venv antes de instalar qualquer coisa num projeto novo.',
      codeExample: {
        lang: 'bash',
        code: 'python -m venv venv          # cria o ambiente virtual\nsource venv/bin/activate     # ativa (Linux/Mac)\npip install fastapi requests # instala dependências só nesse ambiente\npip freeze > requirements.txt # salva a lista de dependências, tipo package.json',
      },
    },
    {
      id: 'l5',
      heading: 'FastAPI: construindo uma API Python moderna',
      body:
        'FastAPI é hoje o framework mais usado pra construir APIs em Python — rápido (o nome não é exagero), com documentação automática gerada a partir do código (via Swagger), e validação de dados integrada usando type hints do próprio Python.\n\nO conceito central é parecido com Express: você define rotas, cada uma associada a uma função. A diferença é que FastAPI usa as anotações de tipo da função pra validar automaticamente o que chega na requisição, sem você escrever validação manual.',
      codeExample: {
        lang: 'python',
        code: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Usuario(BaseModel):\n    nome: str\n    idade: int\n\n@app.post("/usuarios")\ndef criar_usuario(usuario: Usuario):\n    return {"mensagem": f"Usuário {usuario.nome} criado"}',
      },
    },
    {
      id: 'l6',
      heading: 'Decorators: modificando o comportamento de uma função por fora',
      body:
        'Um decorator é uma função que "envolve" outra função, adicionando comportamento antes/depois de ela rodar, sem precisar mudar o código de dentro da função original. Você já usou decorators sem saber: o `@app.post("/usuarios")` do exemplo anterior é um decorator — ele registra a função como uma rota da API.\n\nDecorators são muito usados pra coisas transversais: medir tempo de execução, logar chamadas, verificar autenticação antes de rodar a função — exatamente o mesmo papel que middleware cumpre no Express.',
      codeExample: {
        lang: 'python',
        code: 'import time\n\ndef medir_tempo(funcao):\n    def wrapper(*args, **kwargs):\n        inicio = time.time()\n        resultado = funcao(*args, **kwargs)\n        print(f"{funcao.__name__} levou {time.time() - inicio:.2f}s")\n        return resultado\n    return wrapper\n\n@medir_tempo\ndef tarefa_lenta():\n    time.sleep(1)\n\ntarefa_lenta()  # tarefa_lenta levou 1.00s',
      },
    },
    {
      id: 'l7',
      heading: 'Por que Python domina em dados e IA',
      body:
        'A razão de Python ser tão forte em ciência de dados e IA não é a linguagem em si ser especial — é o ecossistema de bibliotecas construído ao redor dela ao longo de quase 20 anos. pandas (manipulação de dados tabulares), numpy (operações numéricas rápidas), scikit-learn (machine learning clássico), PyTorch/TensorFlow (deep learning) — praticamente toda pesquisa e ferramenta nova de IA sai primeiro com suporte em Python.\n\nIsso não significa que Python seja a melhor linguagem em performance crua (ela não é) — significa que o **tempo de desenvolvimento** e a disponibilidade de ferramentas prontas compensam isso de sobra pra esse tipo de trabalho.',
    },
  ],
  resources: [
    { label: 'Python Docs (oficial)', url: 'https://docs.python.org/pt-br/3/' },
    { label: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com' },
    { label: 'Real Python', url: 'https://realpython.com' },
  ],
  checklist: [
    { id: 'c1', label: 'Escrevi uma função com *args e **kwargs' },
    { id: 'c2', label: 'Criei um ambiente virtual e instalei dependências' },
    { id: 'c3', label: 'Construí uma API simples com FastAPI' },
    { id: 'c4', label: 'Escrevi um decorator próprio' },
  ],
  goalLabel: 'Conseguir ler e escrever Python o suficiente pra contribuir num projeto backend ou de automação.',
  exercises: [
    {
      type: 'mcq',
      id: 'm20-e1',
      prompt: 'Em Python, o que define onde um bloco de código (de um if, função, loop) começa e termina?',
      options: ['Chaves {}', 'Indentação (espaços/tabs)', 'Ponto e vírgula', 'Parênteses'],
      correctIndex: 1,
      explanation: 'Diferente de JS/Java, Python usa a indentação como parte da sintaxe — não é só estilo, é o que define os blocos de código.',
    },
    {
      type: 'mcq',
      id: 'm20-e2',
      prompt: 'Qual a diferença principal entre uma lista e uma tupla em Python?',
      options: [
        'Não há diferença real',
        'Lista é mutável (pode mudar depois de criada); tupla é imutável',
        'Tupla só aceita números',
        'Lista só pode ter um item',
      ],
      correctIndex: 1,
      explanation: 'Tuplas são imutáveis por design — uma vez criadas, seus valores não podem ser alterados, o que é útil para representar dados que não deveriam mudar.',
    },
    {
      type: 'code-fill',
      id: 'm20-e3',
      prompt: 'Complete a list comprehension que retorna o quadrado de cada número de uma lista.',
      codeTemplate: 'quadrados = [n ___ 2 for n in numeros]',
      answer: '**',
      hint: 'O operador de potência em Python (diferente de ^, que em Python é XOR bit a bit).',
      explanation: '`**` é o operador de potenciação em Python — `n ** 2` eleva n ao quadrado.',
    },
    {
      type: 'mcq',
      id: 'm20-e4',
      prompt: 'O que **kwargs captura numa função Python?',
      options: [
        'Uma lista de argumentos posicionais',
        'Argumentos nomeados extras, organizados num dicionário',
        'Só argumentos numéricos',
        'Nada, é só uma convenção de nome',
      ],
      correctIndex: 1,
      explanation: '**kwargs (keyword arguments) recebe qualquer argumento nomeado extra que não foi explicitamente declarado na assinatura da função, organizando-os num dict.',
    },
    {
      type: 'truefalse',
      id: 'm20-e5',
      prompt: 'É uma boa prática instalar bibliotecas Python diretamente no ambiente global do sistema, em vez de usar um ambiente virtual por projeto.',
      answer: false,
      explanation: 'Sem um ambiente virtual, projetos diferentes podem entrar em conflito exigindo versões diferentes da mesma biblioteca — o venv isola as dependências de cada projeto.',
    },
    {
      type: 'mcq',
      id: 'm20-e6',
      prompt: 'O que torna o FastAPI capaz de validar dados automaticamente, sem você escrever validação manual?',
      options: [
        'Ele não valida nada automaticamente',
        'Ele usa os type hints (anotações de tipo) das classes Pydantic para validar a estrutura dos dados recebidos',
        'Validação só funciona com bancos SQL',
        'É preciso instalar um plugin separado para isso',
      ],
      correctIndex: 1,
      explanation: 'FastAPI lê as anotações de tipo de modelos Pydantic (como nome: str) e gera validação automática, rejeitando requisições que não correspondem ao formato esperado.',
    },
    {
      type: 'mcq',
      id: 'm20-e7',
      prompt: 'O que um decorator faz, na prática?',
      options: [
        'Deixa o código mais bonito visualmente, sem efeito funcional',
        'Envolve uma função, adicionando comportamento antes/depois dela rodar, sem mudar o código de dentro da função original',
        'Só funciona com classes',
        'Substitui a necessidade de funções',
      ],
      correctIndex: 1,
      explanation: 'Decorators interceptam a chamada de uma função para adicionar comportamento extra (logging, medição de tempo, autenticação) de forma reutilizável e separada da lógica principal.',
    },
  ],
  games: [
    {
      gameId: 'python-detective',
      label: 'Detetive Python',
      description: 'Preveja a saída exata de trechos de Python — treine as pegadinhas mais comuns da linguagem.',
    },
  ],
};
