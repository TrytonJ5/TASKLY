export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida';
export type PrioridadeTarefa = 'baixa' | 'media' | 'alta';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface Tarefa {
  id: string;
  usuarioId: string;
  titulo: string;
  descricao: string | null;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  responsavel: string | null;
  dataLimite: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HistoricoTarefa {
  id: string;
  tarefaId: string;
  alteradoPor: string | null;
  campoAlterado: string;
  valorAnterior: string | null;
  valorNovo: string | null;
  alteradoEm: string;
}

export interface DashboardContadores {
  pendentes: number;
  concluidas: number;
  atrasadas: number;
}

export interface FiltrosTarefa {
  status?: StatusTarefa;
  prioridade?: PrioridadeTarefa;
  responsavel?: string;
  busca?: string;
  dataLimiteAte?: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface RegistrarDTO {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface CriarTarefaDTO {
  titulo: string;
  descricao?: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  responsavel?: string;
  dataLimite?: string;
}

export interface AtualizarTarefaDTO {
  titulo?: string;
  descricao?: string;
  status?: StatusTarefa;
  prioridade?: PrioridadeTarefa;
  responsavel?: string;
  dataLimite?: string | null;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
