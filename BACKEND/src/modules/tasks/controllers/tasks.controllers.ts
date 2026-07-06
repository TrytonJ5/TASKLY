import { Response, NextFunction } from 'express';
import { RequestAutenticada } from '../../../shared/middlewares/auth.middleware.js';
import * as tasksService from '../service/tasks.service.js';
import {
  criarTarefaSchema,
  atualizarTarefaSchema,
  filtrosTarefaSchema,
} from '../schema/task.schema.js';

// Utilitário: extrai o id do usuário autenticado ou lança 401
function getUsuarioId(req: RequestAutenticada): string {
  if (!req.usuario?.id) throw new Error('Usuário não autenticado');
  return req.usuario.id;
}

// ─── GET /api/tarefas ─────────────────────────────────────────────────────────
export async function listar(
  req: RequestAutenticada,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const usuarioId = getUsuarioId(req);
    // Filtros vêm via query string: ?status=pendente&prioridade=alta&busca=api
    const filtros = filtrosTarefaSchema.parse(req.query);
    const tarefas = await tasksService.listarTarefas(usuarioId, filtros);
    res.status(200).json(tarefas);
  } catch (erro) {
    next(erro);
  }
}

// ─── GET /api/tarefas/dashboard ───────────────────────────────────────────────
export async function dashboard(
  req: RequestAutenticada,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const usuarioId = getUsuarioId(req);
    const contadores = await tasksService.obterContadores(usuarioId);
    res.status(200).json(contadores);
  } catch (erro) {
    next(erro);
  }
}

// ─── GET /api/tarefas/:id/historico ──────────────────────────────────────────
export async function historico(
  req: RequestAutenticada,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const usuarioId = getUsuarioId(req);
    const historico = await tasksService.obterHistorico(
      req.params['id'] as string,
      usuarioId
    );
    res.status(200).json(historico);
  } catch (erro) {
    next(erro);
  }
}

// ─── POST /api/tarefas ────────────────────────────────────────────────────────
export async function criar(
  req: RequestAutenticada,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const usuarioId = getUsuarioId(req);
    const dados = criarTarefaSchema.parse(req.body);
    const tarefa = await tasksService.criarTarefa(usuarioId, dados);
    res.status(201).json(tarefa);
  } catch (erro) {
    next(erro);
  }
}

// ─── PUT /api/tarefas/:id ────────────────────────────────────────────────────
export async function atualizar(
  req: RequestAutenticada,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const usuarioId = getUsuarioId(req);
    const dados = atualizarTarefaSchema.parse(req.body);
    const tarefa = await tasksService.atualizarTarefa(
      req.params['id'] as string,
      usuarioId,
      dados
    );
    res.status(200).json(tarefa);
  } catch (erro) {
    next(erro);
  }
}

// ─── DELETE /api/tarefas/:id ─────────────────────────────────────────────────
export async function remover(
  req: RequestAutenticada,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const usuarioId = getUsuarioId(req);
    await tasksService.removerTarefa(req.params['id'] as string, usuarioId);
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}
