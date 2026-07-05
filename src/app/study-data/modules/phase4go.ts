import type { Module } from '../types';

export const mes21: Module = {
  id: 'mes-21',
  month: 21,
  phase: 4,
  track: 'backend',
  title: 'Go (Golang)',
  emoji: '🐹',
  tagline: 'A linguagem por trás de Docker, Kubernetes e meio mundo da infra moderna.',
  intro:
    'Go foi criada no Google pra resolver um problema específico: compilar rápido, rodar rápido, e ser simples o suficiente pra times grandes manterem sem dor de cabeça. Hoje é a linguagem de boa parte da infraestrutura que você já usa — Docker, Kubernetes, Terraform são todos escritos em Go. É uma escolha forte pra quem quer ir pra vagas de infraestrutura/backend de alta performance.',
  lessons: [
    {
      id: 'l1',
      heading: 'Por que Go existe: simplicidade como funcionalidade',
      body:
        'Go foi desenhada deliberadamente com **poucos recursos** comparada a outras linguagens — sem herança de classes, sem generics complexos (até a versão 1.18), sem exceções tradicionais. Isso é proposital: o objetivo é que qualquer dev consiga ler o código de qualquer outro dev no time sem precisar aprender um estilo pessoal complexo.\n\nO trade-off: código Go às vezes parece "repetitivo" pra quem vem de linguagens mais expressivas — mas essa previsibilidade é exatamente o que faz times grandes (como o do Google) conseguirem manter milhões de linhas de código sem confusão.',
      codeExample: {
        lang: 'go',
        code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Olá, mundo!")\n}',
      },
    },
    {
      id: 'l2',
      heading: 'Tipagem estática e inferência: o melhor dos dois mundos',
      body:
        'Go é fortemente tipada (como Java/TypeScript), mas com inferência de tipo — você não precisa escrever o tipo toda vez, o compilador descobre pelo valor atribuído. Isso dá a segurança de tipos sem o verbo excessivo de linguagens como Java mais antigas.\n\nDiferente de Python/JS, não existe null/None/undefined genérico — cada tipo tem seu "valor zero" (zero value): número é 0, string é vazia, booleano é false. Isso elimina uma categoria inteira de bugs de "esqueci de inicializar".',
      codeExample: {
        lang: 'go',
        code: 'var nome string = "Ana"  // explícito\nidade := 28               // inferido como int\n\nvar contador int  // valor zero: 0, não "undefined"\nfmt.Println(contador) // 0',
      },
    },
    {
      id: 'l3',
      heading: 'Goroutines: concorrência leve e barata',
      body:
        'Uma {{thread}} tradicional do sistema operacional é "cara" — cada uma consome memória considerável, e criar milhares delas trava qualquer máquina. Uma **goroutine** é a unidade de concorrência do Go, muito mais leve (alguns KB de memória cada) — é normal um programa Go rodar centenas de milhares de goroutines simultaneamente sem problema.\n\nIniciar uma goroutine é simplesmente colocar a palavra "go" antes de chamar uma função — ela roda em paralelo, sem bloquear o resto do código.',
      codeExample: {
        lang: 'go',
        code: 'func buscarDados(url string) {\n    fmt.Println("buscando", url)\n}\n\nfunc main() {\n    go buscarDados("https://api1.com")  // roda em paralelo\n    go buscarDados("https://api2.com")  // roda em paralelo\n    time.Sleep(time.Second) // espera as goroutines terminarem\n}',
      },
    },
    {
      id: 'l4',
      heading: 'Channels: como goroutines conversam entre si com segurança',
      body:
        'Se goroutines rodam em paralelo, como elas trocam informação sem causar condição de corrida (duas tentando escrever o mesmo dado ao mesmo tempo)? **Channels** são a resposta: um "tubo" tipado por onde uma goroutine envia um valor e outra recebe, de forma segura e sincronizada — a filosofia do Go é "não compartilhe memória, comunique através de um canal".\n\nIsso resolve, na prática, o mesmo problema que locks/mutexes resolvem em outras linguagens, mas de um jeito mais simples de raciocinar.',
      codeExample: {
        lang: 'go',
        code: 'func calcular(canal chan int) {\n    resultado := 10 * 10\n    canal <- resultado // envia pelo canal\n}\n\nfunc main() {\n    canal := make(chan int)\n    go calcular(canal)\n    valor := <-canal // espera e recebe do canal\n    fmt.Println(valor) // 100\n}',
      },
      diagramId: 'goroutine-channel',
    },
    {
      id: 'l5',
      heading: 'Tratamento de erros: sem exceções, valores explícitos',
      body:
        'Go não tem try/catch tradicional. Funções que podem falhar retornam o erro como um **valor normal**, geralmente o último valor de retorno — e o código que chama a função é obrigado (por convenção forte, não pelo compilador) a checar esse erro explicitamente antes de seguir.\n\nIsso parece verboso no início (comparado a um único try/catch envolvendo várias chamadas), mas torna extremamente claro, lendo o código, exatamente onde cada erro pode acontecer e como ele é tratado — nada de erro "escapando" silenciosamente.',
      codeExample: {
        lang: 'go',
        code: 'func dividir(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, errors.New("divisão por zero")\n    }\n    return a / b, nil\n}\n\nresultado, err := dividir(10, 0)\nif err != nil {\n    fmt.Println("Erro:", err)\n    return\n}\nfmt.Println(resultado)',
      },
    },
    {
      id: 'l6',
      heading: 'Construindo uma API HTTP simples em Go',
      body:
        'O pacote net/http da biblioteca padrão já é suficiente pra construir uma API funcional, sem precisar de framework — diferente de Node.js, onde Express é praticamente obrigatório. Em produção, frameworks como Gin ou Fiber adicionam conveniências (roteamento mais rico, middlewares), mas o conceito básico já funciona só com a biblioteca padrão.',
      codeExample: {
        lang: 'go',
        code: 'package main\n\nimport (\n    "encoding/json"\n    "net/http"\n)\n\nfunc handler(w http.ResponseWriter, r *http.Request) {\n    w.Header().Set("Content-Type", "application/json")\n    json.NewEncoder(w).Encode(map[string]string{"mensagem": "ola"})\n}\n\nfunc main() {\n    http.HandleFunc("/api", handler)\n    http.ListenAndServe(":8080", nil)\n}',
      },
    },
    {
      id: 'l7',
      heading: 'Compilação para binário único: deploy sem dependências',
      body:
        'Diferente de Node.js (que precisa do runtime instalado no servidor) ou Java (que precisa da JVM), Go compila pra um **binário único e independente** — você roda go build, e o resultado é um arquivo executável que não precisa de nada mais instalado na máquina de destino, nem mesmo o Go.\n\nIsso explica por que ferramentas de infraestrutura (Docker, Terraform, kubectl) são escritas em Go: a distribuição é trivial — você baixa um único arquivo e já funciona, sem instalar runtime, sem gerenciar versões de dependência no servidor de produção.',
      codeExample: {
        lang: 'bash',
        code: 'go build -o minha-api main.go\n./minha-api  # roda direto, sem instalar nada além do binário gerado',
      },
    },
  ],
  resources: [
    { label: 'Tour of Go (interativo, oficial)', url: 'https://go.dev/tour/' },
    { label: 'Go by Example', url: 'https://gobyexample.com' },
    { label: 'Effective Go', url: 'https://go.dev/doc/effective_go' },
  ],
  checklist: [
    { id: 'c1', label: 'Escrevi um programa Go simples e compilei' },
    { id: 'c2', label: 'Usei goroutines e channels juntos' },
    { id: 'c3', label: 'Tratei um erro do jeito idiomático do Go (sem try/catch)' },
    { id: 'c4', label: 'Construí uma API HTTP simples' },
  ],
  goalLabel: 'Entender por que Go domina em infraestrutura, e conseguir escrever um serviço simples nela.',
  exercises: [
    {
      type: 'mcq',
      id: 'm21-e1',
      prompt: 'Por que Go foi desenhada com deliberadamente menos recursos (sem herança de classes, etc) que outras linguagens?',
      options: [
        'Por limitação técnica dos criadores',
        'Pra priorizar simplicidade e previsibilidade — qualquer dev do time consegue ler código de qualquer outro sem precisar aprender estilos complexos',
        'Porque Go é uma linguagem antiga',
        'Não há razão específica'
      ],
      correctIndex: 1,
      explanation: 'A simplicidade de Go é uma escolha deliberada de design, pensada para times grandes manterem código de forma consistente e previsível.',
    },
    {
      type: 'mcq',
      id: 'm21-e2',
      prompt: 'Em Go, o que é o "valor zero" de uma variável int não inicializada?',
      options: ['null', 'undefined', '0', 'Erro de compilação'],
      correctIndex: 2,
      explanation: 'Go não tem null/undefined genérico — cada tipo tem seu valor zero padrão, e para int esse valor é 0.',
    },
    {
      type: 'truefalse',
      id: 'm21-e3',
      prompt: 'Uma goroutine consome aproximadamente a mesma quantidade de memória que uma thread tradicional do sistema operacional.',
      answer: false,
      explanation: 'Goroutines são muito mais leves que threads do SO — é normal rodar centenas de milhares delas simultaneamente, algo impraticável com threads tradicionais.',
    },
    {
      type: 'mcq',
      id: 'm21-e4',
      prompt: 'Qual o papel de um channel em Go?',
      options: [
        'Armazenar dados permanentemente, como um banco',
        'Permitir que goroutines troquem dados entre si de forma segura e sincronizada, evitando condições de corrida',
        'Substituir a necessidade de funções',
        'Channels só existem em outras linguagens, não em Go'
      ],
      correctIndex: 1,
      explanation: 'Channels seguem a filosofia "não compartilhe memória, comunique através de um canal" — uma forma segura de goroutines trocarem dados sem acesso direto à mesma variável.',
    },
    {
      type: 'mcq',
      id: 'm21-e5',
      prompt: 'Como uma função em Go normalmente sinaliza que algo deu errado?',
      options: [
        'Lançando uma exceção com throw',
        'Retornando um valor de erro explícito, geralmente como o último valor de retorno da função',
        'Go não tem como sinalizar erros',
        'Usando try/catch como em outras linguagens'
      ],
      correctIndex: 1,
      explanation: 'Go trata erros como valores normais de retorno, não como exceções — o código que chama a função precisa checar esse valor explicitamente.',
    },
    {
      type: 'truefalse',
      id: 'm21-e6',
      prompt: 'Um binário compilado em Go precisa do runtime do Go instalado na máquina onde ele vai rodar.',
      answer: false,
      explanation: 'Go compila para um binário único e independente — ele não precisa de nenhum runtime ou dependência externa instalada na máquina de destino.',
    },
  ],
  games: [
    {
      gameId: 'go-concurrency',
      label: 'Detetive da Concorrência',
      description: 'Preveja o comportamento real de goroutines, channels e tratamento de erros em Go.',
    },
  ],
};
