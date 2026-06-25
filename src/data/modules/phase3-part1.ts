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
      id: 'l0',
      heading: 'Monolito vs Microsserviços: o ponto de partida da decisão',
      body:
        'Antes de entrar nos detalhes técnicos, vale visualizar a diferença estrutural. Um monolito é uma aplicação única, onde todos os módulos (usuários, pedidos, pagamentos) vivem no mesmo processo e compartilham o mesmo banco. Microsserviços quebram isso em aplicações independentes, cada uma com seu próprio banco, que se comunicam pela rede.\n\nNenhuma das duas é "melhor" universalmente — é uma troca de simplicidade inicial por flexibilidade de escala e times independentes. Compare visualmente abaixo.',
      diagramId: 'monolith-vs-micro',
    },
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
    {
      id: 'l4',
      heading: 'Idempotência: repetir uma operação sem duplicar efeitos',
      body:
        'Numa rede distribuída, uma requisição pode ser enviada duas vezes por acidente — o cliente não recebeu confirmação a tempo e tentou de novo, sem saber se a primeira chegou. Uma operação **idempotente** produz o mesmo resultado final independente de quantas vezes for executada: "marcar pedido #123 como pago" é idempotente; "adicionar R$ 50 ao saldo" não é, porque repetir duplica o efeito.\n\nNa prática, isso geralmente é resolvido com uma **chave de idempotência**: o cliente envia um identificador único junto com a requisição, e o servidor guarda quais chaves já processou, ignorando (ou retornando o mesmo resultado de) requisições repetidas com a mesma chave.',
    },
    {
      id: 'l5',
      heading: 'Saga: transações que atravessam múltiplos serviços',
      body:
        'Quando uma operação de negócio (ex: "finalizar pedido") precisa coordenar mudanças em vários microsserviços diferentes (pagamento, estoque, envio), não existe uma transação de banco tradicional que cubra todos eles ao mesmo tempo. O padrão Saga resolve isso executando uma sequência de passos locais, cada um com uma **ação compensatória** definida caso algo falhe no meio do caminho.\n\nSe o pagamento for aprovado mas o estoque não tiver o item, a Saga executa a compensação: cancela o pagamento já feito. Isso troca a garantia "tudo ou nada instantâneo" por "eventualmente consistente, com reversão automática em caso de falha". Simule abaixo o caminho de sucesso e o de falha com compensação.',
      diagramId: 'saga-pattern',
    },
    {
      id: 'l6',
      heading: 'Comunicação síncrona vs assíncrona: a decisão arquitetural mais comum',
      body:
        'Toda comunicação entre serviços é, no fundo, uma escolha entre dois modelos. **Síncrona** (chamada HTTP direta): o chamador espera a resposta antes de continuar — simples de entender e debugar, mas cria acoplamento de disponibilidade (se o destino cai, quem chama também é afetado). **Assíncrona** (mensageria/fila): o chamador publica e segue seu fluxo, sem esperar — mais resiliente a falhas parciais, mas mais complexa de rastrear e debugar.\n\nA regra prática: use síncrono quando você genuinamente precisa da resposta para continuar (buscar dados para mostrar na tela); use assíncrono quando a ação pode ser processada "depois" sem bloquear o usuário (enviar um email de confirmação, atualizar um índice de busca).',
      diagramId: 'async-communication',
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
    {
      type: 'mcq',
      id: 'm13-e4',
      prompt: 'Qual destas operações é idempotente?',
      options: [
        '"Adicionar R$ 50 ao saldo da conta"',
        '"Marcar o pedido #123 como entregue"',
        '"Incrementar o contador de visualizações em 1"',
        '"Enviar um e-mail de notificação"',
      ],
      correctIndex: 1,
      explanation:
        'Marcar um pedido como entregue resulta no mesmo estado final independente de quantas vezes a operação for repetida. As outras opções acumulam efeito a cada repetição.',
    },
    {
      type: 'truefalse',
      id: 'm13-e5',
      prompt: 'O padrão Saga garante uma transação atômica tradicional (tudo ou nada, instantânea) entre múltiplos microsserviços.',
      answer: false,
      explanation:
        'Saga não oferece atomicidade instantânea — ela coordena passos locais com ações compensatórias caso algo falhe, alcançando consistência eventual, não uma transação atômica clássica.',
    },
    {
      type: 'code-fill',
      id: 'm13-e6',
      prompt: 'Complete o conceito: um identificador único enviado pelo cliente para evitar duplicar o efeito de uma requisição repetida.',
      codeTemplate: 'Chave de ___',
      answer: 'idempotência',
      hint: 'O termo que descreve operações que produzem o mesmo resultado final mesmo se executadas múltiplas vezes.',
      explanation: 'A chave de idempotência permite que o servidor identifique e ignore (ou retorne o mesmo resultado de) requisições duplicadas.',
    },
    {
      type: 'mcq',
      id: 'm13-e7',
      prompt: 'Você está implementando "enviar email de boas-vindas após cadastro". Por que isso é um bom candidato para comunicação assíncrona?',
      options: [
        'Porque emails são sempre urgentes',
        'Porque o usuário não precisa esperar o email ser enviado para continuar usando o sistema — isso pode ser processado depois',
        'Comunicação assíncrona é sempre obrigatória',
        'Não há diferença entre as duas abordagens nesse caso',
      ],
      correctIndex: 1,
      explanation: 'Ações que não bloqueiam a experiência imediata do usuário (como enviar um email) são ótimas candidatas a processamento assíncrono, sem fazer o usuário esperar.',
    },
    {
      type: 'truefalse',
      id: 'm13-e8',
      prompt: 'Comunicação síncrona cria acoplamento de disponibilidade: se o serviço chamado cair, quem chama também é afetado.',
      answer: true,
      explanation: 'Numa chamada síncrona direta, o chamador fica esperando a resposta — se o destino estiver fora do ar ou lento, isso se propaga diretamente para quem fez a chamada.',
    },
  ],
  games: [
    {
      gameId: 'microservices-architect',
      label: 'Arquiteto de Microsserviços',
      description: 'Desenhe a topologia de um sistema dado um cenário de negócio, decidindo onde colocar gateway, filas e circuit breakers.',
    },
    {
      gameId: 'architecture-builder',
      label: 'Arquiteto de Sistemas',
      description: 'Monte fluxos de componentes, incluindo o cenário de mensageria assíncrona com fila Kafka.',
    },
  ],
  scenarios: [
    {
      id: 'mes13-cen1',
      context: 'trabalho',
      title: 'Um serviço lento derruba o sistema inteiro',
      emoji: '🕸️',
      situation:
        'O serviço de envio de e-mails fica lento (problema num provedor externo), e isso causa lentidão em cascata em todo o sistema — até funcionalidades que não dependem de e-mail ficam travadas.',
      whatHappens:
        'Sem Circuit Breaker, cada chamada ao serviço de e-mail fica esperando indefinidamente por uma resposta. Como threads/conexões ficam ocupadas esperando, o sistema inteiro fica sem capacidade para atender outras requisições, mesmo não relacionadas.',
      howToSolve:
        'Um Circuit Breaker nas chamadas a esse serviço detecta as falhas repetidas e "abre o circuito" — passa a falhar rápido em vez de esperar, dando tempo do serviço de e-mail se recuperar sem arrastar o resto do sistema junto.',
    },
    {
      id: 'mes13-cen2',
      context: 'pessoal',
      title: 'Organizando tarefas domésticas entre moradores da casa',
      emoji: '🏠',
      situation:
        'Numa casa compartilhada, cada pessoa cuida de uma responsabilidade (compras, limpeza, contas) de forma independente, mas tudo precisa "se encontrar" no fim do mês.',
      whatHappens:
        'É uma boa analogia para microsserviços: cada pessoa (serviço) é independente e tem sua própria responsabilidade, mas eventualmente precisam se comunicar (ex: "já paguei a conta de luz") sem que uma trave o trabalho da outra.',
      howToSolve:
        'Um grupo de mensagens (WhatsApp, por exemplo) funciona como a "fila de eventos" da casa — cada pessoa publica uma atualização quando termina sua parte, e as outras reagem quando podem, sem precisar de sincronização em tempo real constante.',
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
        'Um **Pod** é a menor unidade do Kubernetes — geralmente um container (ou alguns acoplados) rodando junto. Um **Deployment** descreve o estado desejado: "quero 3 réplicas deste Pod rodando sempre" — se um cair, o Kubernetes cria outro automaticamente para manter esse número.\n\nUm **Service** dá um endereço de rede estável para um conjunto de Pods, mesmo que Pods individuais sejam recriados com IPs novos constantemente. Experimente "matar" um Pod abaixo e veja o Kubernetes recriá-lo automaticamente.',
      codeExample: {
        lang: 'yaml',
        code: 'apiVersion: apps/v1\nkind: Deployment\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n        - name: api\n          image: minha-api:1.0',
      },
      diagramId: 'k8s-pods',
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
    {
      id: 'l5',
      heading: 'Liveness e Readiness Probes: como o Kubernetes sabe se um Pod está saudável',
      body:
        'Um **Liveness Probe** verifica periodicamente se o container ainda está funcionando — se falhar repetidamente, o Kubernetes reinicia o container automaticamente. Um **Readiness Probe** verifica se o container está pronto para receber tráfego — um Pod pode estar "vivo" mas ainda inicializando (carregando cache, conectando ao banco), e nesse caso o Service não deve enviar requisições para ele ainda.\n\nSem essas probes configuradas, o Kubernetes assume que qualquer Pod em execução está pronto para tráfego, o que pode causar erros para usuários durante deploys ou reinicializações.',
      codeExample: {
        lang: 'yaml',
        code: 'livenessProbe:\n  httpGet:\n    path: /health\n    port: 8080\n  periodSeconds: 10\nreadinessProbe:\n  httpGet:\n    path: /ready\n    port: 8080',
      },
    },
    {
      id: 'l6',
      heading: 'Horizontal Pod Autoscaler: escalando automaticamente',
      body:
        'O HPA (Horizontal Pod Autoscaler) monitora métricas (geralmente uso de CPU) e ajusta automaticamente o número de réplicas de um Deployment dentro de um intervalo mínimo e máximo definido por você. Em um pico de tráfego, mais Pods são criados; quando a demanda cai, Pods extras são removidos.\n\nEsse é o equivalente, dentro do cluster Kubernetes, ao Auto Scaling de instâncias EC2 que você viu no módulo de AWS — o princípio é o mesmo: capacidade que acompanha a demanda real, em vez de superprovisionar para o pior cenário 24 horas por dia.',
    },
    {
      id: 'l7',
      heading: 'Namespaces: organizando múltiplos ambientes no mesmo cluster',
      body:
        'Um cluster Kubernetes pode hospedar vários ambientes ou times ao mesmo tempo (desenvolvimento, staging, produção, ou times diferentes) usando **Namespaces** — uma forma de dividir logicamente os recursos do cluster, evitando que um Deployment de "dev" colida em nome com um de "prod".\n\nCotas de recursos (`ResourceQuota`) podem ser aplicadas por namespace, limitando quanto CPU/memória um time específico pode consumir, evitando que um ambiente de testes mal configurado consuma recursos que deveriam estar disponíveis para produção.',
      codeExample: {
        lang: 'bash',
        code: 'kubectl create namespace staging\nkubectl apply -f deployment.yaml --namespace=staging\nkubectl get pods --namespace=staging',
      },
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
    {
      type: 'mcq',
      id: 'm14-e5',
      prompt: 'Qual a diferença prática entre Liveness Probe e Readiness Probe?',
      options: [
        'São a mesma coisa com nomes diferentes',
        'Liveness reinicia o container se ele estiver travado; Readiness controla se ele deve receber tráfego agora',
        'Liveness só funciona em produção',
        'Readiness substitui completamente o Service',
      ],
      correctIndex: 1,
      explanation:
        'Liveness Probe lida com "o container está vivo?" (reinicia se não). Readiness Probe lida com "o container está pronto para tráfego agora?" (o Service só envia requisições se sim).',
    },
    {
      type: 'truefalse',
      id: 'm14-e6',
      prompt: 'O Horizontal Pod Autoscaler (HPA) e o Auto Scaling de EC2 resolvem essencialmente o mesmo tipo de problema, em camadas diferentes.',
      answer: true,
      explanation:
        'Ambos ajustam capacidade automaticamente baseado em demanda — HPA escala Pods dentro de um cluster Kubernetes, enquanto Auto Scaling de EC2 escala máquinas virtuais inteiras.',
    },
    {
      type: 'mcq',
      id: 'm14-e7',
      prompt: 'Qual o propósito principal de um Namespace no Kubernetes?',
      options: [
        'Acelerar a aplicação',
        'Dividir logicamente os recursos do cluster entre ambientes ou times, evitando colisão de nomes e permitindo cotas de recursos',
        'Substituir o Deployment',
        'Criptografar a comunicação entre Pods',
      ],
      correctIndex: 1,
      explanation: 'Namespaces permitem que múltiplos ambientes (dev, staging, produção) ou times coexistam no mesmo cluster físico, com isolamento lógico e controle de cotas.',
    },
  ],
  games: [
    {
      gameId: 'k8s-resource-builder',
      label: 'Montador de Recursos K8s',
      description: 'Monte o YAML de Deployment, Service e Ingress corretos para um cenário de aplicação dado.',
    },
  ],
  scenarios: [
    {
      id: 'mes14-cen1',
      context: 'trabalho',
      title: 'Deploy "trava" usuários por alguns segundos',
      emoji: '⏸️',
      situation:
        'Toda vez que uma nova versão é implantada, usuários relatam alguns segundos de erro 502 — mesmo o time garantindo que o código novo "funciona perfeitamente".',
      whatHappens:
        'O Kubernetes está enviando tráfego para Pods novos antes deles estarem realmente prontos para receber requisições (ainda conectando ao banco, carregando cache) — sem Readiness Probe configurada, o cluster assume erroneamente que todo Pod em execução já está pronto.',
      howToSolve:
        'Configurar uma Readiness Probe que só responde "pronto" depois que a aplicação realmente terminou sua inicialização garante que o Service só direcione tráfego para Pods de fato capazes de atender — eliminando essa janela de erro durante deploys.',
    },
    {
      id: 'mes14-cen2',
      context: 'pessoal',
      title: 'Entendendo por que o Wi-Fi de casa as vezes cai',
      emoji: '📶',
      situation:
        'Seu roteador de casa às vezes "trava" e precisa ser reiniciado manualmente quando muitos dispositivos estão conectados ao mesmo tempo.',
      whatHappens:
        'Isso é, em miniatura, o problema que Health Checks e auto-restart resolvem em produção: um sistema (seu roteador, ou um Pod no Kubernetes) que entra num estado ruim e precisa de um reinício para voltar a funcionar normalmente.',
      howToSolve:
        'Da mesma forma que o Kubernetes reinicia automaticamente um Pod que falha numa Liveness Probe, alguns roteadores domésticos têm "auto-reboot agendado" — uma solução pragmática até a causa raiz (geralmente firmware ou hardware limitado) ser endereçada.',
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
        '**CI (Continuous Integration)**: toda vez que código é enviado, uma pipeline automaticamente roda testes, lint e build — pegando problemas antes que cheguem à branch principal. **CD (Continuous Delivery/Deployment)**: o código que passa por todas as validações é automaticamente entregue (ou até implantado em produção) sem intervenção manual.\n\nGitHub Actions define essas pipelines em arquivos YAML versionados junto do código. Simule abaixo uma pipeline passando, e outra falhando no meio do caminho.',
      codeExample: {
        lang: 'yaml',
        code: 'name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm install\n      - run: npm test',
      },
      diagramId: 'cicd-pipeline-diagram',
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
    {
      id: 'l5',
      heading: 'Estratégias de deploy: blue-green e canary',
      body:
        'Substituir a versão antiga pela nova de uma vez (deploy "big bang") significa que, se a nova versão tiver um bug, todos os usuários sentem o impacto imediatamente. Duas estratégias reduzem esse risco:\n\n**Blue-Green**: você mantém duas versões completas rodando em paralelo (azul = atual, verde = nova). Quando a verde está validada, o tráfego é redirecionado de uma vez — e se algo der errado, basta apontar de volta para a azul, sem novo deploy.\n\n**Canary**: a nova versão recebe só uma pequena fração do tráfego real (ex: 5%) primeiro. Se as métricas continuarem saudáveis, a fração aumenta gradualmente até 100%. Isso limita o "raio de explosão" de um bug a uma pequena parte dos usuários, com detecção antes do impacto total.',
    },
    {
      id: 'l6',
      heading: 'SLO, SLI e SLA: definindo o que "funcionando" significa',
      body:
        '**SLI** (Service Level Indicator) é uma métrica concreta: "porcentagem de requisições respondidas em menos de 200ms". **SLO** (Service Level Objective) é a meta interna para essa métrica: "99% das requisições em menos de 200ms, medido por mês". **SLA** (Service Level Agreement) é o compromisso formal com o cliente, geralmente com penalidade contratual se não for cumprido.\n\nA distinção importa: SLOs costumam ser mais rígidos que os SLAs prometidos a clientes, dando margem de segurança ("orçamento de erro") antes de efetivamente violar um compromisso contratual.',
    },
    {
      id: 'l7',
      heading: 'Feature Flags: lançando funcionalidades sem precisar fazer deploy',
      body:
        'Uma feature flag é um interruptor remoto que liga ou desliga uma funcionalidade em produção, sem precisar de um novo deploy. Isso desacopla "colocar o código em produção" de "ativar a funcionalidade para os usuários" — você pode fazer deploy de um código novo desligado, e ativá-lo gradualmente depois (para 5% dos usuários, depois 50%, depois todos).\n\nIsso também viabiliza o "rollback instantâneo": se uma funcionalidade nova causar problemas, desligar a flag reverte o comportamento imediatamente, sem precisar reverter um deploy inteiro (que pode levar minutos e afetar outras mudanças que foram junto).',
      codeExample: {
        lang: 'javascript',
        code: 'if (featureFlags.isEnabled("novo-checkout", usuario)) {\n  return <NovoCheckout />;\n}\nreturn <CheckoutAntigo />;',
      },
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
    {
      type: 'mcq',
      id: 'm15-e4',
      prompt: 'Qual a principal vantagem de um deploy canary sobre substituir 100% do tráfego de uma vez?',
      options: [
        'É sempre mais rápido',
        'Limita o impacto de um bug a uma pequena fração de usuários antes de liberar para todos',
        'Não precisa de monitoramento',
        'Elimina a necessidade de testes antes do deploy',
      ],
      correctIndex: 1,
      explanation:
        'Ao direcionar só uma pequena fração do tráfego para a nova versão inicialmente, problemas são detectados com impacto limitado, antes de afetar todos os usuários.',
    },
    {
      type: 'truefalse',
      id: 'm15-e5',
      prompt: 'Em um deploy blue-green, reverter para a versão anterior em caso de problema exige um novo deploy completo.',
      answer: false,
      explanation:
        'A vantagem do blue-green é justamente essa: como a versão antiga continua rodando em paralelo, reverter é só redirecionar o tráfego de volta para ela — sem precisar fazer deploy novamente.',
    },
    {
      type: 'mcq',
      id: 'm15-e6',
      prompt: 'Qual a diferença entre SLO e SLA?',
      options: [
        'São sinônimos exatos',
        'SLO é a meta interna da equipe; SLA é o compromisso formal (geralmente contratual) com o cliente',
        'SLA é só para empresas pequenas',
        'SLO mede só uptime, SLA mede só latência',
      ],
      correctIndex: 1,
      explanation:
        'SLOs costumam ser mais rígidos que os SLAs prometidos externamente, funcionando como uma margem de segurança antes de efetivamente violar um compromisso com o cliente.',
    },
    {
      type: 'mcq',
      id: 'm15-e7',
      prompt: 'Qual a principal vantagem de uma feature flag sobre um deploy tradicional para lançar uma funcionalidade nova?',
      options: [
        'Não há vantagem real',
        'Permite ativar/desativar a funcionalidade remotamente e gradualmente, sem precisar de um novo deploy',
        'Feature flags tornam o código mais rápido',
        'Substituem completamente a necessidade de testes',
      ],
      correctIndex: 1,
      explanation: 'Feature flags desacoplam "código em produção" de "funcionalidade ativa para usuários", permitindo rollout gradual e rollback instantâneo sem novo deploy.',
    },
  ],
  games: [
    {
      gameId: 'cicd-pipeline-builder',
      label: 'Montador de Pipeline',
      description: 'Ordene os estágios de uma pipeline CI/CD (lint, teste, build, deploy) na sequência correta e mais eficiente.',
    },
  ],
  scenarios: [
    {
      id: 'mes15-cen1',
      context: 'trabalho',
      title: 'Um bug "óbvio" chega em produção mesmo assim',
      emoji: '🙃',
      situation:
        'Um bug que quebra a tela de login chega para todos os usuários em produção, e quando o time investiga, percebe que um teste que cobriria exatamente esse caso existia, mas estava marcado como "ignorado" há meses.',
      whatHappens:
        'Testes ignorados (skip) acumulam silenciosamente — cada um parecia razoável de pular "só essa vez", mas com o tempo a suíte de testes para de proteger contra exatamente os bugs que ela foi escrita para pegar.',
      howToSolve:
        'Pipelines de CI deveriam falhar (não só avisar) quando a cobertura de testes cai abaixo de um limite, e testes ignorados deveriam ter prazo de validade — revisar periodicamente o que está marcado como skip evita que a rede de segurança vá se esvaziando sem ninguém notar.',
    },
    {
      id: 'mes15-cen2',
      context: 'pessoal',
      title: 'Automatizando backup de fotos importantes',
      emoji: '📸',
      situation:
        'Você quer garantir que suas fotos pessoais sejam copiadas automaticamente para outro lugar (nuvem, disco externo) sem precisar lembrar de fazer isso manualmente.',
      whatHappens:
        'Isso é o mesmo princípio de CI/CD aplicado à vida pessoal: em vez de confiar na memória humana para repetir uma tarefa importante, você automatiza para que aconteça sempre, de forma confiável, sem intervenção.',
      howToSolve:
        'Um script agendado (cron no Linux/Mac, Agendador de Tarefas no Windows) que copia uma pasta para outro destino periodicamente resolve isso — o mesmo conceito de "pipeline automatizada" que você está aprendendo, só num contexto pessoal em vez de deploy de software.',
    },
  ],
};
