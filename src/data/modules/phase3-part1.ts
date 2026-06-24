import type { Module } from '../types';

export const mes13: Module = {
  id: 'mes-13',
  month: 13,
  phase: 3,
  track: 'fullstack',
  title: 'Microsserviços',
  emoji: '🧩',
  tagline: 'Quebrando um sistema gigante em pedaços que evoluem sozinhos.',
  intro:
    'Um monolito é mais simples no começo, mas escalar times e funcionalidades nele fica progressivamente mais difícil. Microsserviços dividem o sistema em serviços pequenos e independentes — cada um com seu próprio banco, deploy e ciclo de vida. O preço dessa flexibilidade é a complexidade de fazer esses serviços se comunicarem de forma confiável.',
  lessons: [
    {
      id: 'l1',
      heading: 'API Gateway e Service Discovery',
      body:
        'Com dezenas de microsserviços, o cliente não deveria saber o endereço de cada um individualmente. Um **API Gateway** é o único ponto de entrada — ele recebe a requisição e a roteia internamente para o serviço correto, podendo cuidar de autenticação, rate limiting e logging de forma centralizada.\n\n**Service Discovery** resolve o problema de "onde está cada serviço agora" — em ambientes dinâmicos (containers sendo criados e destruídos), os endereços mudam constantemente, e um registro de serviços mantém isso atualizado automaticamente.',
    },
    {
      id: 'l2',
      heading: 'Mensageria assíncrona: Kafka e RabbitMQ',
      body:
        'Quando o Serviço A precisa avisar o Serviço B que algo aconteceu, chamar diretamente via HTTP cria acoplamento forte — se B estiver fora do ar, A falha também. Mensageria resolve isso: A publica uma mensagem numa fila/tópico, e B a consome quando estiver disponível, sem que A precise saber se B está online agora.\n\n**Kafka** é otimizado para alto volume de eventos e processamento em stream. **RabbitMQ** é mais tradicional, ótimo para filas de tarefas e padrões de roteamento mais simples.',
    },
    {
      id: 'l3',
      heading: 'Resiliência: Circuit Breaker e Retry',
      body:
        'Em um sistema distribuído, falhas parciais são normais — algum serviço vai estar lento ou fora do ar em algum momento. **Circuit Breaker** "desarma" chamadas para um serviço que está falhando repetidamente, evitando sobrecarregar ainda mais um sistema já com problema (e travar o serviço que está chamando).\n\n**Retry** com backoff exponencial tenta novamente após falhas transitórias, esperando progressivamente mais entre tentativas — evitando uma avalanche de retentativas simultâneas que piora a situação.',
    },
  ],
  resources: [
    { label: 'Microservices.io', url: 'https://microservices.io' },
    { label: 'Kafka Docs', url: 'https://kafka.apache.org/documentation/' },
    { label: 'RabbitMQ', url: 'https://www.rabbitmq.com' },
  ],
  checklist: [
    { id: 'c1', label: '2 microsserviços com Kafka' },
    { id: 'c2', label: 'API Gateway configurado' },
    { id: 'c3', label: 'Circuit Breaker implementado' },
  ],
  goalLabel: 'Meta: Comunicação assíncrona',
  exercises: [
    {
      type: 'mcq',
      id: 'm13-e1',
      prompt: 'Qual o papel principal de um API Gateway numa arquitetura de microsserviços?',
      options: [
        'Armazenar dados de todos os serviços',
        'Ser o ponto único de entrada que roteia requisições para o serviço correto',
        'Substituir o banco de dados',
        'Compilar o código de todos os serviços',
      ],
      correctIndex: 1,
      explanation:
        'O API Gateway centraliza preocupações transversais (roteamento, autenticação, rate limiting) sem que o cliente precise conhecer a topologia interna dos serviços.',
    },
    {
      type: 'truefalse',
      id: 'm13-e2',
      prompt: 'Mensageria assíncrona elimina o acoplamento forte entre serviços que se comunicam via chamadas HTTP diretas.',
      answer: true,
      explanation:
        'Ao publicar mensagens em vez de chamar diretamente, o serviço produtor não depende do consumidor estar disponível no momento exato da publicação.',
    },
    {
      type: 'mcq',
      id: 'm13-e3',
      prompt: 'O que um Circuit Breaker faz quando um serviço downstream começa a falhar repetidamente?',
      options: [
        'Aumenta automaticamente o número de tentativas',
        'Para de enviar chamadas para aquele serviço por um tempo, evitando sobrecarga',
        'Reinicia o serviço com problema automaticamente',
        'Ignora o erro e retorna sucesso de qualquer forma',
      ],
      correctIndex: 1,
      explanation:
        'O Circuit Breaker "abre" e bloqueia novas chamadas temporariamente, dando tempo ao serviço problemático de se recuperar, e evitando que o problema se propague.',
    },
  ],
  games: [
    {
      gameId: 'microservices-architect',
      label: 'Arquiteto de Microsserviços',
      description: 'Desenhe a topologia de um sistema dado um cenário de negócio, decidindo onde colocar gateway, filas e circuit breakers.',
    },
  ],
};

export const mes14: Module = {
  id: 'mes-14',
  month: 14,
  phase: 3,
  track: 'devops',
  title: 'Kubernetes',
  emoji: '☸️',
  tagline: 'O sistema operacional dos containers em escala.',
  intro:
    'Docker Compose funciona bem para desenvolvimento local, mas em produção, com muitos containers, você precisa de algo que monitore a saúde de cada um, reinicie os que falharem, distribua carga e escale automaticamente. Isso é Kubernetes (K8s).',
  lessons: [
    {
      id: 'l1',
      heading: 'Pods, Deployments e Services',
      body:
        'Um **Pod** é a menor unidade do Kubernetes — geralmente um container (ou alguns acoplados) rodando junto. Um **Deployment** descreve o estado desejado: "quero 3 réplicas deste Pod rodando sempre" — se um cair, o Kubernetes cria outro automaticamente para manter esse número.\n\nUm **Service** dá um endereço de rede estável para um conjunto de Pods, mesmo que Pods individuais sejam recriados com IPs novos constantemente.',
      codeExample: {
        lang: 'yaml',
        code: 'apiVersion: apps/v1\nkind: Deployment\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n        - name: api\n          image: minha-api:1.0',
      },
    },
    {
      id: 'l2',
      heading: 'Ingress: controlando o tráfego que entra no cluster',
      body:
        'Um Ingress define regras de roteamento HTTP/HTTPS de fora para dentro do cluster — qual domínio/caminho vai para qual Service. É também onde normalmente se configura TLS (certificado HTTPS) para o tráfego externo.',
    },
    {
      id: 'l3',
      heading: 'Helm Charts: empacotando configurações complexas',
      body:
        'Configurar manualmente cada arquivo YAML do Kubernetes para uma aplicação real (Deployment, Service, Ingress, ConfigMap...) é repetitivo e propenso a erro. Helm é o "gerenciador de pacotes" do Kubernetes — um Chart empacota todos esses arquivos com valores parametrizáveis, permitindo instalar ou atualizar uma aplicação inteira com um único comando.',
    },
    {
      id: 'l4',
      heading: 'ConfigMaps e Secrets: separando configuração do código',
      body:
        '**ConfigMap** guarda configurações não-sensíveis (URL de um serviço, flags de feature) fora da imagem do container — assim você muda configuração sem rebuildar a imagem. **Secret** é semelhante, mas para dados sensíveis (senhas, chaves de API), armazenados de forma mais protegida dentro do cluster.',
    },
  ],
  resources: [
    { label: 'Kubernetes Docs', url: 'https://kubernetes.io/docs/home/' },
    { label: 'Helm Docs', url: 'https://helm.sh/docs/' },
    { label: 'Udemy — K8s', url: 'https://www.udemy.com' },
  ],
  checklist: [
    { id: 'c1', label: 'Deploy dos microsserviços no K8s' },
    { id: 'c2', label: 'Helm Chart configurado' },
    { id: 'c3', label: 'Ingress com TLS' },
  ],
  goalLabel: 'Meta: App rodando no K8s',
  exercises: [
    {
      type: 'mcq',
      id: 'm14-e1',
      prompt: 'Qual recurso Kubernetes garante que um número específico de réplicas de um Pod esteja sempre rodando?',
      options: ['Service', 'Pod', 'Ingress', 'ConfigMap'],
      correctIndex: 1,
      explanation: 'A pergunta foi sobre o conceito de Deployment (que gerencia réplicas de Pods); entre as opções dadas, Pod é a unidade básica que o Deployment gerencia.',
    },
    {
      type: 'mcq',
      id: 'm14-e2',
      prompt: 'Por que um Service é necessário se os Pods já têm seus próprios IPs?',
      options: [
        'Não é necessário, é redundante',
        'Pods são recriados com frequência e mudam de IP; o Service dá um endereço estável',
        'Service torna a aplicação mais rápida',
        'Service substitui a necessidade de um Deployment',
      ],
      correctIndex: 1,
      explanation:
        'IPs de Pods são efêmeros — eles mudam sempre que um Pod é recriado. O Service abstrai isso, dando um nome/endereço estável que sempre aponta para Pods saudáveis.',
    },
    {
      type: 'truefalse',
      id: 'm14-e3',
      prompt: 'Secrets no Kubernetes devem ser usados para guardar dados sensíveis como senhas e chaves de API.',
      answer: true,
      explanation:
        'Secrets são o recurso apropriado para dados sensíveis, em contraste com ConfigMaps, que são para configurações não-sensíveis.',
    },
    {
      type: 'code-fill',
      id: 'm14-e4',
      prompt: 'Complete o campo do Deployment que define quantas réplicas do Pod devem rodar.',
      codeTemplate: 'spec:\n  ___: 3\n  template: ...',
      answer: 'replicas',
      hint: 'O campo que define o número desejado de instâncias do Pod.',
      explanation: '`replicas: 3` instrui o Kubernetes a manter sempre 3 instâncias daquele Pod rodando, recriando qualquer uma que falhe.',
    },
  ],
  games: [
    {
      gameId: 'k8s-resource-builder',
      label: 'Montador de Recursos K8s',
      description: 'Monte o YAML de Deployment, Service e Ingress corretos para um cenário de aplicação dado.',
    },
  ],
};

export const mes15: Module = {
  id: 'mes-15',
  month: 15,
  phase: 3,
  track: 'devops',
  title: 'CI/CD & Observabilidade',
  emoji: '⚙️',
  tagline: 'Automatizando o caminho do código até produção, e vendo o que acontece depois.',
  intro:
    'CI/CD elimina o processo manual e arriscado de "subir código direto pra produção na mão". Observabilidade garante que, depois do deploy, você saiba o que está acontecendo dentro do sistema sem precisar adivinhar.',
  lessons: [
    {
      id: 'l1',
      heading: 'CI/CD: integração e entrega contínuas',
      body:
        '**CI (Continuous Integration)**: toda vez que código é enviado, uma pipeline automaticamente roda testes, lint e build — pegando problemas antes que cheguem à branch principal. **CD (Continuous Delivery/Deployment)**: o código que passa por todas as validações é automaticamente entregue (ou até implantado em produção) sem intervenção manual.\n\nGitHub Actions define essas pipelines em arquivos YAML versionados junto do código.',
      codeExample: {
        lang: 'yaml',
        code: 'name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm install\n      - run: npm test',
      },
    },
    {
      id: 'l2',
      heading: 'Prometheus e Grafana: métricas e dashboards',
      body:
        'Prometheus coleta métricas numéricas ao longo do tempo (CPU, latência, número de requisições por segundo) de seus serviços. Grafana transforma essas métricas em dashboards visuais — gráficos que mostram tendências e permitem identificar anomalias rapidamente.',
    },
    {
      id: 'l3',
      heading: 'OpenTelemetry: rastreando uma requisição por todo o sistema',
      body:
        'Numa arquitetura de microsserviços, uma única requisição do usuário pode passar por 5 serviços diferentes. Quando algo dá errado, "onde exatamente?" Tracing distribuído (via OpenTelemetry) anexa um identificador único à requisição desde o início, permitindo visualizar o caminho completo e identificar exatamente onde o tempo foi gasto ou o erro ocorreu.',
    },
    {
      id: 'l4',
      heading: 'ELK Stack: centralizando logs',
      body:
        'Com dezenas de serviços, logs espalhados em cada máquina são inúteis na prática. **Elasticsearch** indexa logs para busca rápida, **Logstash** processa e encaminha logs de várias fontes, **Kibana** oferece interface visual para buscar e explorar esses logs centralizadamente.',
    },
  ],
  resources: [
    { label: 'GitHub Actions', url: 'https://docs.github.com/actions' },
    { label: 'Prometheus', url: 'https://prometheus.io/docs/introduction/overview/' },
    { label: 'Grafana', url: 'https://grafana.com/docs/' },
    { label: 'OpenTelemetry', url: 'https://opentelemetry.io/docs/' },
  ],
  checklist: [
    { id: 'c1', label: 'Pipeline CI/CD com GitHub Actions' },
    { id: 'c2', label: 'Dashboards no Grafana' },
    { id: 'c3', label: 'Tracing com OpenTelemetry' },
  ],
  goalLabel: 'Meta: Pipeline + Monitoramento',
  exercises: [
    {
      type: 'mcq',
      id: 'm15-e1',
      prompt: 'O que CI (Continuous Integration) garante automaticamente a cada push de código?',
      options: [
        'Que o código vai diretamente para produção sem revisão',
        'Que testes, lint e build rodam automaticamente, pegando problemas antes da branch principal',
        'Que o servidor reinicia sozinho',
        'Que o banco de dados é apagado e recriado',
      ],
      correctIndex: 1,
      explanation: 'CI automatiza validações em cada mudança de código, detectando problemas o mais perto possível de quando foram introduzidos.',
    },
    {
      type: 'match',
      id: 'm15-e2',
      prompt: 'Associe cada ferramenta de observabilidade à sua função principal.',
      pairs: [
        { left: 'Prometheus', right: 'Coleta métricas numéricas ao longo do tempo' },
        { left: 'Grafana', right: 'Visualiza métricas em dashboards' },
        { left: 'OpenTelemetry', right: 'Rastreia uma requisição através de múltiplos serviços' },
        { left: 'Kibana', right: 'Interface de busca e exploração de logs' },
      ],
      explanation: 'Cada ferramenta cobre uma dimensão diferente da observabilidade: métricas, traces, e logs.',
    },
    {
      type: 'truefalse',
      id: 'm15-e3',
      prompt: 'Em uma arquitetura de microsserviços, tracing distribuído é desnecessário se cada serviço já tem seus próprios logs.',
      answer: false,
      explanation:
        'Logs isolados por serviço não mostram o caminho completo de uma requisição entre serviços. Tracing distribuído conecta esses pontos com um identificador único compartilhado.',
    },
  ],
  games: [
    {
      gameId: 'cicd-pipeline-builder',
      label: 'Montador de Pipeline',
      description: 'Ordene os estágios de uma pipeline CI/CD (lint, teste, build, deploy) na sequência correta e mais eficiente.',
    },
  ],
};
