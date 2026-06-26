import type { PracticalChallenge } from './interviewTypes';

export const practicalChallenges: PracticalChallenge[] = [
  {
    id: 'pr-01',
    track: ['frontend', 'backend', 'fullstack'],
    level: ['junior'],
    title: 'Encontrar o maior número',
    prompt:
      'Complete a função `maiorNumero` para que ela retorne o maior valor de um array de números, sem usar `Math.max(...array)`.',
    starterCode:
      'function maiorNumero(numeros) {\n  let maior = numeros[0];\n  // seu código aqui\n\n  return maior;\n}',
    solutionContains: ['for', 'if', 'maior'],
    hint: 'Percorra o array comparando cada número com o maior encontrado até agora, atualizando quando achar um maior.',
    idealApproach:
      'function maiorNumero(numeros) {\n  let maior = numeros[0];\n  for (let i = 1; i < numeros.length; i++) {\n    if (numeros[i] > maior) {\n      maior = numeros[i];\n    }\n  }\n  return maior;\n}',
  },
  {
    id: 'pr-02',
    track: ['frontend', 'backend', 'fullstack'],
    level: ['junior', 'pleno'],
    title: 'Verificar palíndromo',
    prompt:
      'Complete a função `ehPalindromo` para que retorne `true` se a string for igual a ela mesma invertida (ignorando maiúsculas/minúsculas), e `false` caso contrário.',
    starterCode:
      'function ehPalindromo(texto) {\n  const normalizado = texto.toLowerCase();\n  // seu código aqui\n\n}',
    solutionContains: ['split', 'reverse', 'join'],
    hint: 'Strings podem ser transformadas em array (split(\'\')), invertidas (reverse()) e voltarem a ser string (join(\'\')) para comparação.',
    idealApproach:
      'function ehPalindromo(texto) {\n  const normalizado = texto.toLowerCase();\n  const invertido = normalizado.split("").reverse().join("");\n  return normalizado === invertido;\n}',
  },
  {
    id: 'pr-03',
    track: ['frontend', 'fullstack'],
    level: ['pleno'],
    title: 'Remover duplicatas mantendo a ordem',
    prompt:
      'Complete a função `removerDuplicatas` para retornar um novo array sem valores repetidos, mantendo a ordem original de aparição.',
    starterCode: 'function removerDuplicatas(lista) {\n  // seu código aqui\n\n}',
    solutionContains: ['Set', 'filter'],
    hint: 'Um Set armazena só valores únicos automaticamente — `[...new Set(lista)]` já resolve isso em uma linha.',
    idealApproach: 'function removerDuplicatas(lista) {\n  return [...new Set(lista)];\n}',
  },
  {
    id: 'pr-04',
    track: ['backend', 'fullstack'],
    level: ['pleno'],
    title: 'Agrupar itens por categoria',
    prompt:
      'Complete a função `agruparPorCategoria` que recebe uma lista de produtos `{ nome, categoria }` e retorna um objeto onde cada chave é uma categoria e o valor é a lista de nomes de produtos daquela categoria.',
    starterCode:
      'function agruparPorCategoria(produtos) {\n  const grupos = {};\n  // seu código aqui\n\n  return grupos;\n}',
    solutionContains: ['forEach', 'categoria', 'push'],
    hint: 'Para cada produto, verifique se a categoria já existe no objeto; se não, crie um array vazio para ela antes de adicionar o nome.',
    idealApproach:
      'function agruparPorCategoria(produtos) {\n  const grupos = {};\n  produtos.forEach(p => {\n    if (!grupos[p.categoria]) {\n      grupos[p.categoria] = [];\n    }\n    grupos[p.categoria].push(p.nome);\n  });\n  return grupos;\n}',
  },
  {
    id: 'pr-05',
    track: ['frontend', 'backend', 'fullstack'],
    level: ['pleno', 'senior'],
    title: 'Debounce de uma função',
    prompt:
      'Complete a função `debounce(fn, delay)` que retorna uma nova função: toda vez que ela é chamada, cancela a execução pendente anterior e agenda uma nova depois de `delay` milissegundos.',
    starterCode:
      'function debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    // seu código aqui\n\n  };\n}',
    solutionContains: ['clearTimeout', 'setTimeout'],
    hint: 'Cada nova chamada deveria cancelar o temporizador anterior (clearTimeout) antes de criar um novo (setTimeout).',
    idealApproach:
      'function debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}',
  },
  {
    id: 'pr-06',
    track: ['backend', 'fullstack'],
    level: ['senior'],
    title: 'Memoização simples',
    prompt:
      'Complete a função `memoize(fn)` que armazena em cache o resultado de chamadas anteriores com os mesmos argumentos, evitando recalcular.',
    starterCode:
      'function memoize(fn) {\n  const cache = new Map();\n  return function (...args) {\n    const chave = JSON.stringify(args);\n    // seu código aqui\n\n  };\n}',
    solutionContains: ['cache.has', 'cache.get', 'cache.set'],
    hint: 'Verifique se a chave já está no cache; se sim, retorne o valor cacheado; se não, calcule, armazene, e então retorne.',
    idealApproach:
      'function memoize(fn) {\n  const cache = new Map();\n  return function (...args) {\n    const chave = JSON.stringify(args);\n    if (cache.has(chave)) {\n      return cache.get(chave);\n    }\n    const resultado = fn(...args);\n    cache.set(chave, resultado);\n    return resultado;\n  };\n}',
  },
  {
    id: 'pr-07',
    track: ['frontend', 'fullstack'],
    level: ['junior', 'pleno'],
    title: 'Achatar um array aninhado',
    prompt:
      'Complete a função `achatar` que transforma um array com níveis de aninhamento (ex: [1, [2, [3, 4]], 5]) em um único array plano [1, 2, 3, 4, 5].',
    starterCode: 'function achatar(lista) {\n  // seu código aqui\n\n}',
    solutionContains: ['flat', 'Infinity'],
    hint: 'O método nativo `.flat(Infinity)` resolve isso para qualquer nível de aninhamento em uma única chamada.',
    idealApproach: 'function achatar(lista) {\n  return lista.flat(Infinity);\n}',
  },
  {
    id: 'pr-08',
    track: ['security', 'backend', 'fullstack'],
    level: ['junior', 'pleno'],
    title: 'Corrigindo uma query vulnerável a SQL Injection',
    prompt:
      'A função abaixo está vulnerável a SQL Injection porque concatena o email direto na query. Reescreva-a usando query parametrizada.',
    starterCode:
      'function buscarUsuario(email) {\n  const query = `SELECT * FROM usuarios WHERE email = \'${email}\'`;\n  // reescreva usando parâmetro seguro\n\n}',
    solutionContains: ['$1', 'db.query'],
    hint: 'Use um placeholder ($1) na string da query, e passe o valor real num array separado como segundo argumento de db.query.',
    idealApproach:
      'function buscarUsuario(email) {\n  const query = "SELECT * FROM usuarios WHERE email = $1";\n  return db.query(query, [email]);\n}',
  },
  {
    id: 'pr-09',
    track: ['security', 'backend', 'fullstack'],
    level: ['pleno', 'senior'],
    title: 'Hash de senha com bcrypt',
    prompt:
      'Complete a função de cadastro para guardar a senha como hash (usando bcrypt), nunca em texto puro.',
    starterCode:
      'async function cadastrar(email, senha) {\n  // gere o hash da senha antes de salvar\n\n  await db.usuarios.create({ data: { email, senha: hash } });\n}',
    solutionContains: ['bcrypt.hash', 'await'],
    hint: 'bcrypt.hash(senha, custo) retorna uma Promise com o hash já incluindo o salt — geralmente custo 10 é um valor razoável.',
    idealApproach:
      'async function cadastrar(email, senha) {\n  const hash = await bcrypt.hash(senha, 10);\n  await db.usuarios.create({ data: { email, senha: hash } });\n}',
  },
];
