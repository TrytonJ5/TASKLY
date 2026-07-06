/**
 * Smoke test dos endpoints de tarefas.
 * Precisa do servidor rodando (`npm run dev`) em outro terminal.
 *
 * Como rodar:
 *   npx tsx scripts/test-tasks.ts
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

function encerrar(): void {
  console.log(`\n${passou} passaram, ${falhou} falharam\n`);
  process.exit(falhou > 0 ? 1 : 0);
}

async function registrarELogar(): Promise<string> {
  const email = `teste.tasks.${Date.now()}@taskly.com`;

  await fetch(`${BASE_URL}/api/auth/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Usuário Teste Tasks',
      email,
      senha: '12345678',
      confirmarSenha: '12345678',
    }),
  });

  const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha: '12345678' }),
  });

  const corpo = await resLogin.json();
  return corpo.token as string;
}

async function main(): Promise<void> {
  console.log(`\nRodando smoke tests de tarefas contra ${BASE_URL}\n`);

  // Cadastra e loga um usuário de teste pra obter o token
  let token: string;
  try {
    token = await registrarELogar();
  } catch {
    console.log('❌ Não foi possível criar usuário de teste. Servidor está rodando?\n');
    encerrar();
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 1. Dashboard antes de criar qualquer tarefa
  const resDash = await fetch(`${BASE_URL}/api/tarefas/dashboard`, { headers });
  const dash = await resDash.json();
  log(
    resDash.status === 200 &&
      dash.pendentes === 0 &&
      dash.concluidas === 0 &&
      dash.atrasadas === 0,
    'GET /api/tarefas/dashboard — retorna contadores zerados para usuário novo'
  );

  // 2. Listagem vazia
  const resLista = await fetch(`${BASE_URL}/api/tarefas`, { headers });
  const lista = await resLista.json();
  log(
    resLista.status === 200 && Array.isArray(lista) && lista.length === 0,
    'GET /api/tarefas — lista vazia para usuário sem tarefas'
  );

  // 3. Criar tarefa válida
  const resCriar = await fetch(`${BASE_URL}/api/tarefas`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      titulo: 'Tarefa de teste',
      descricao: 'Descrição da tarefa de teste',
      status: 'pendente',
      prioridade: 'alta',
      responsavel: 'João Victor',
      dataLimite: '2099-12-31',
    }),
  });
  const tarefaCriada = await resCriar.json();
  log(
    resCriar.status === 201 && typeof tarefaCriada.id === 'string',
    'POST /api/tarefas — cria tarefa e retorna 201'
  );
  const tarefaId = tarefaCriada.id as string;

  // 4. Criar tarefa sem título (deve falhar)
  const resSemTitulo = await fetch(`${BASE_URL}/api/tarefas`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ descricao: 'Sem título' }),
  });
  log(resSemTitulo.status === 400, 'POST /api/tarefas — sem título retorna 400');

  // 5. Listagem com 1 tarefa
  const resListaComTarefa = await fetch(`${BASE_URL}/api/tarefas`, { headers });
  const listaComTarefa = await resListaComTarefa.json();
  log(
    resListaComTarefa.status === 200 && listaComTarefa.length === 1,
    'GET /api/tarefas — retorna a tarefa criada'
  );

  // 6. Filtro por status
  const resFiltroStatus = await fetch(
    `${BASE_URL}/api/tarefas?status=pendente`,
    { headers }
  );
  const listaFiltrada = await resFiltroStatus.json();
  log(
    resFiltroStatus.status === 200 && listaFiltrada.length === 1,
    'GET /api/tarefas?status=pendente — retorna tarefa pendente'
  );

  // 7. Busca textual
  const resBusca = await fetch(
    `${BASE_URL}/api/tarefas?busca=teste`,
    { headers }
  );
  const listaBusca = await resBusca.json();
  log(
    resBusca.status === 200 && listaBusca.length === 1,
    'GET /api/tarefas?busca=teste — encontra tarefa pelo título'
  );

  // 8. Busca sem resultado
  const resBuscaVazia = await fetch(
    `${BASE_URL}/api/tarefas?busca=xyzinexistente`,
    { headers }
  );
  const listaBuscaVazia = await resBuscaVazia.json();
  log(
    resBuscaVazia.status === 200 && listaBuscaVazia.length === 0,
    'GET /api/tarefas?busca=xyzinexistente — lista vazia para busca sem resultado'
  );

  // 9. Atualizar tarefa
  const resAtualizar = await fetch(`${BASE_URL}/api/tarefas/${tarefaId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status: 'em_andamento', prioridade: 'media' }),
  });
  const tarefaAtualizada = await resAtualizar.json();
  log(
    resAtualizar.status === 200 && tarefaAtualizada.status === 'em_andamento',
    'PUT /api/tarefas/:id — atualiza status corretamente'
  );

  // 10. Dashboard reflete a tarefa criada
  const resDash2 = await fetch(`${BASE_URL}/api/tarefas/dashboard`, { headers });
  const dash2 = await resDash2.json();
  log(
    resDash2.status === 200 && dash2.pendentes === 1 && dash2.atrasadas === 0,
    'GET /api/tarefas/dashboard — contadores refletem a tarefa criada'
  );

  // 11. Histórico registrou as alterações
  const resHistorico = await fetch(
    `${BASE_URL}/api/tarefas/${tarefaId}/historico`,
    { headers }
  );
  const historico = await resHistorico.json();
  log(
    resHistorico.status === 200 && historico.length >= 2,
    'GET /api/tarefas/:id/historico — registrou as alterações feitas'
  );

  // 12. Acesso negado sem token
  const resSemToken = await fetch(`${BASE_URL}/api/tarefas`);
  log(resSemToken.status === 401, 'GET /api/tarefas — sem token retorna 401');

  // 13. Deletar tarefa
  const resRemover = await fetch(`${BASE_URL}/api/tarefas/${tarefaId}`, {
    method: 'DELETE',
    headers,
  });
  log(resRemover.status === 204, 'DELETE /api/tarefas/:id — retorna 204');

  // 14. Confirma que sumiu da listagem
  const resDepoisDelecao = await fetch(`${BASE_URL}/api/tarefas`, { headers });
  const listaDepoisDelecao = await resDepoisDelecao.json();
  log(
    resDepoisDelecao.status === 200 && listaDepoisDelecao.length === 0,
    'GET /api/tarefas — lista vazia após deletar a tarefa'
  );

  encerrar();
}

main();
