import { ApiError } from '../../../shared/middlewares/error.middleware.js';
import * as tasksRepository from '../repositories/tasks.repositories.js';
import {
  CriarTarefaDTO,
  AtualizarTarefaDTO,
  FiltrosTarefaDTO,
} from '../schema/task.schema.js';

// ─── Listagem e Dashboard ────────────────────────────────────────────────────

export async function listarTarefas(
  usuarioId: string,
  filtros: FiltrosTarefaDTO
) {
  return tasksRepository.listarPorUsuario(usuarioId, filtros);
}

export async function obterContadores(usuarioId: string) {
  return tasksRepository.contarPorUsuario(usuarioId);
}

export async function obterHistorico(tarefaId: string, usuarioId: string) {
  await verificarPropriedade(tarefaId, usuarioId);
  return tasksRepository.buscarHistorico(tarefaId);
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function criarTarefa(usuarioId: string, dados: CriarTarefaDTO) {
  return tasksRepository.criar(usuarioId, dados);
}

export async function atualizarTarefa(
  tarefaId: string,
  usuarioId: string,
  dados: AtualizarTarefaDTO
) {
  const tarefaAtual = await verificarPropriedade(tarefaId, usuarioId);

  // Grava no histórico apenas os campos que de fato mudaram
  const camposMonitorados = [
    'titulo',
    'descricao',
    'status',
    'prioridade',
    'responsavel',
    'dataLimite',
  ] as const;

  for (const campo of camposMonitorados) {
    const valorNovo = dados[campo];
    if (valorNovo === undefined) continue;

    const valorAnterior = tarefaAtual[campo];
    const anteriorStr = valorAnterior ? String(valorAnterior) : null;
    const novoStr = valorNovo !== null ? String(valorNovo) : null;

    if (anteriorStr !== novoStr) {
      await tasksRepository.registrarHistorico({
        tarefaId,
        alteradoPor: usuarioId,
        campoAlterado: campo,
        valorAnterior: anteriorStr,
        valorNovo: novoStr,
      });
    }
  }

  return tasksRepository.atualizar(tarefaId, dados);
}

export async function removerTarefa(tarefaId: string, usuarioId: string) {
  await verificarPropriedade(tarefaId, usuarioId);
  return tasksRepository.remover(tarefaId);
}

// ─── Auxiliar: garante que a tarefa existe e pertence ao usuário logado ──────

async function verificarPropriedade(tarefaId: string, usuarioId: string) {
  const tarefa = await tasksRepository.buscarPorId(tarefaId);

  if (!tarefa) {
    throw new ApiError(404, 'Tarefa não encontrada');
  }

  if (tarefa.usuarioId !== usuarioId) {
    // 403 em vez de 404 só quando sabemos que a tarefa existe mas não pertence
    // a esse usuário — evita vazar que o recurso existe pra quem não deveria saber
    throw new ApiError(403, 'Você não tem permissão para acessar esta tarefa');
  }

  return tarefa;
}
