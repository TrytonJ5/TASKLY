import { z } from 'zod';

const statusEnum = z.enum(['pendente', 'em_andamento', 'concluida']);
const prioridadeEnum = z.enum(['baixa', 'media', 'alta']);

export const criarTarefaSchema = z.object({
  titulo: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(150, 'Título deve ter no máximo 150 caracteres'),
  descricao: z.string().optional(),
  status: statusEnum.default('pendente'),
  prioridade: prioridadeEnum.default('media'),
  responsavel: z.string().optional(),
  dataLimite: z
    .string()
    .date('Data limite inválida (use o formato YYYY-MM-DD)')
    .optional(),
});

export const atualizarTarefaSchema = z.object({
  titulo: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(150, 'Título deve ter no máximo 150 caracteres')
    .optional(),
  descricao: z.string().optional(),
  status: statusEnum.optional(),
  prioridade: prioridadeEnum.optional(),
  responsavel: z.string().optional(),
  dataLimite: z
    .string()
    .date('Data limite inválida (use o formato YYYY-MM-DD)')
    .nullable()
    .optional(),
});

// Parâmetros aceitos em GET /api/tarefas?status=pendente&prioridade=alta...
export const filtrosTarefaSchema = z.object({
  status: statusEnum.optional(),
  prioridade: prioridadeEnum.optional(),
  responsavel: z.string().optional(),
  dataLimiteAte: z.string().date('Data inválida').optional(),
  busca: z.string().optional(), // pesquisa por título ou descrição
});

export type CriarTarefaDTO = z.infer<typeof criarTarefaSchema>;
export type AtualizarTarefaDTO = z.infer<typeof atualizarTarefaSchema>;
export type FiltrosTarefaDTO = z.infer<typeof filtrosTarefaSchema>;
