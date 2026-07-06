import { prisma } from '../../../shared/infra/prisma/client.js';
import {
  CriarTarefaDTO,
  AtualizarTarefaDTO,
  FiltrosTarefaDTO,
} from '../schema/task.schema.js';

// ─── Listagem com filtros dinâmicos e busca textual ─────────────────────────

export async function listarPorUsuario(
  usuarioId: string,
  filtros: FiltrosTarefaDTO
) {
  return prisma.tarefa.findMany({
    where: {
      usuarioId,
      // Cada filtro só é adicionado ao WHERE se o valor foi informado
      ...(filtros.status && { status: filtros.status }),
      ...(filtros.prioridade && { prioridade: filtros.prioridade }),
      ...(filtros.responsavel && {
        responsavel: {
          contains: filtros.responsavel,
          mode: 'insensitive' as const,
        },
      }),
      ...(filtros.dataLimiteAte && {
        dataLimite: { lte: new Date(filtros.dataLimiteAte) },
      }),
      // Busca textual: procura o termo em título OU descrição (case-insensitive)
      ...(filtros.busca && {
        OR: [
          { titulo: { contains: filtros.busca, mode: 'insensitive' as const } },
          {
            descricao: {
              contains: filtros.busca,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    },
    orderBy: [
      // Atrasadas e alta prioridade aparecem primeiro
      { dataLimite: 'asc' },
      { createdAt: 'desc' },
    ],
  });
}

// ─── Busca individual ────────────────────────────────────────────────────────

export async function buscarPorId(id: string) {
  return prisma.tarefa.findUnique({ where: { id } });
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function criar(usuarioId: string, dados: CriarTarefaDTO) {
    return prisma.tarefa.create({
    data: {
      usuarioId: usuarioId,
      titulo: dados.titulo,
      descricao: dados.descricao ?? null,
      status: dados.status,
      prioridade: dados.prioridade,
      responsavel: dados.responsavel ?? null,
      dataLimite: dados.dataLimite ? new Date(dados.dataLimite) : null,
    },
  });

}

export async function atualizar(id: string, dados: AtualizarTarefaDTO) {
  const data: Parameters<typeof prisma.tarefa.update>[0]['data'] = {};

  if (dados.titulo !== undefined) data.titulo = dados.titulo;
  if (dados.descricao !== undefined) data.descricao = dados.descricao;
  if (dados.status !== undefined) data.status = dados.status;
  if (dados.prioridade !== undefined) data.prioridade = dados.prioridade;
  if (dados.responsavel !== undefined) data.responsavel = dados.responsavel;
  if (dados.dataLimite !== undefined) {
    data.dataLimite = dados.dataLimite === null
      ? null
      : new Date(dados.dataLimite);
  }

  return prisma.tarefa.update({ where: { id }, data });
}

export async function remover(id: string) {
  return prisma.tarefa.delete({ where: { id } });
}

// ─── Histórico de alterações ─────────────────────────────────────────────────

export async function registrarHistorico(entrada: {
  tarefaId: string;
  alteradoPor: string;
  campoAlterado: string;
  valorAnterior: string | null;
  valorNovo: string | null;
}) {
  return prisma.historicoTarefa.create({ data: entrada });
}

export async function buscarHistorico(tarefaId: string) {
  return prisma.historicoTarefa.findMany({
    where: { tarefaId },
    orderBy: { alteradoEm: 'desc' },
  });
}

// ─── Contadores do dashboard ─────────────────────────────────────────────────

export async function contarPorUsuario(usuarioId: string) {
  const agora = new Date();

  const [pendentes, concluidas, atrasadas] = await Promise.all([
    // Pendentes: status pendente OU em andamento
    prisma.tarefa.count({
      where: {
        usuarioId,
        status: { in: ['pendente', 'em_andamento'] },
      },
    }),
    // Concluídas
    prisma.tarefa.count({
      where: { usuarioId, status: 'concluida' },
    }),
    // Atrasadas: data limite no passado E não concluída
    prisma.tarefa.count({
      where: {
        usuarioId,
        dataLimite: { lt: agora },
        status: { not: 'concluida' },
      },
    }),
  ]);

  return { pendentes, concluidas, atrasadas };
}
