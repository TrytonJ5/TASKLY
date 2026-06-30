/**
 * Smoke test dos endpoints de autenticação (cadastro + login).
 *
 * Não substitui uma suíte de testes "de verdade" (Jest/Vitest), mas serve
 * pra rodar rapidinho depois de qualquer alteração e garantir que nada
 * quebrou. Precisa do servidor rodando (`npm run dev`) em outro terminal.
 *
 * Como rodar:
 *   npx tsx scripts/test-auth.ts
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let passou = 0;
let falhou = 0;

function log(ok: boolean, descricao: string, detalhe?: string): void {
  if (ok) {
    passou++;
    console.log(`✅ ${descricao}`);
  } else {
    falhou++;
    console.log(`❌ ${descricao}${detalhe ? ` — ${detalhe}` : ''}`);
  }
}

async function main(): Promise<void> {
  // E-mail único a cada execução, pra não colidir com testes anteriores
  const emailTeste = `teste.${Date.now()}@taskly.com`;
  const senha = '12345678';

  console.log(`\nRodando smoke tests contra ${BASE_URL}\n`);

  // 1. Health check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const corpo = await res.json();
    log(res.status === 200 && corpo.status === 'ok', 'GET /health responde 200');
  } catch {
    log(false, 'GET /health responde 200', 'servidor está rodando?');
    console.log('\nServidor parece estar fora do ar. Rode "npm run dev" antes de testar.\n');
    imprimirResumoEEncerrar();
    return;
  }

  // 2. Cadastro válido
  const resCadastro = await fetch(`${BASE_URL}/api/auth/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Usuário de Teste',
      email: emailTeste,
      senha,
      confirmarSenha: senha,
    }),
  });
  const corpoCadastro = await resCadastro.json();
  log(
    resCadastro.status === 201 && corpoCadastro.id && !corpoCadastro.senhaHash,
    'POST /api/auth/registrar — cadastro válido retorna 201 sem expor a senha'
  );

  // 3. Cadastro com e-mail duplicado
  const resDuplicado = await fetch(`${BASE_URL}/api/auth/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Outro Nome',
      email: emailTeste,
      senha,
      confirmarSenha: senha,
    }),
  });
  log(resDuplicado.status === 409, 'POST /api/auth/registrar — e-mail duplicado retorna 409');

  // 4. Cadastro com senhas que não coincidem
  const resSenhasDiferentes = await fetch(`${BASE_URL}/api/auth/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Teste',
      email: `outro.${Date.now()}@taskly.com`,
      senha,
      confirmarSenha: 'senhaDiferente',
    }),
  });
  log(
    resSenhasDiferentes.status === 400,
    'POST /api/auth/registrar — senhas diferentes retorna 400'
  );

  // 5. Cadastro com e-mail em formato inválido
  const resEmailInvalido = await fetch(`${BASE_URL}/api/auth/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Teste',
      email: 'isso-nao-e-um-email',
      senha,
      confirmarSenha: senha,
    }),
  });
  log(resEmailInvalido.status === 400, 'POST /api/auth/registrar — e-mail inválido retorna 400');

  // 6. Login com credenciais corretas
  const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailTeste, senha }),
  });
  const corpoLogin = await resLogin.json();
  log(
    resLogin.status === 200 && typeof corpoLogin.token === 'string',
    'POST /api/auth/login — credenciais corretas retorna 200 com token'
  );

  // 7. Login com senha errada
  const resSenhaErrada = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailTeste, senha: 'senhaErrada123' }),
  });
  log(resSenhaErrada.status === 401, 'POST /api/auth/login — senha errada retorna 401');

  // 8. Login com e-mail inexistente
  const resEmailInexistente = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'naoexiste@taskly.com', senha }),
  });
  log(resEmailInexistente.status === 401, 'POST /api/auth/login — e-mail inexistente retorna 401');

  imprimirResumoEEncerrar();
}

function imprimirResumoEEncerrar(): void {
  console.log(`\n${passou} passaram, ${falhou} falharam\n`);
  process.exit(falhou > 0 ? 1 : 0);
}

main();