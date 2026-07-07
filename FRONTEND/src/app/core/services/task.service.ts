import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Tarefa,
  CriarTarefaDTO,
  AtualizarTarefaDTO,
  FiltrosTarefa,
  DashboardContadores,
  HistoricoTarefa,
} from '../../models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly base = `${environment.apiUrl}/tarefas`;

  constructor(private http: HttpClient) {}

  listar(filtros: FiltrosTarefa = {}) {
    // Monta os query params dinamicamente (só inclui os que têm valor)
    let params = new HttpParams();
    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor !== undefined && valor !== '' && valor !== null) {
        params = params.set(chave, String(valor));
      }
    });
    return this.http.get<Tarefa[]>(this.base, { params });
  }

  obterContadores() {
    return this.http.get<DashboardContadores>(`${this.base}/dashboard`);
  }

  obterHistorico(tarefaId: string) {
    return this.http.get<HistoricoTarefa[]>(
      `${this.base}/${tarefaId}/historico`
    );
  }

  criar(dados: CriarTarefaDTO) {
    return this.http.post<Tarefa>(this.base, dados);
  }

  atualizar(id: string, dados: AtualizarTarefaDTO) {
    return this.http.put<Tarefa>(`${this.base}/${id}`, dados);
  }

  remover(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
