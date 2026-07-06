import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../core/services/task.service';
import { Tarefa, HistoricoTarefa } from '../../../../models';

@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-history.component.html',
  styleUrl: './task-history.component.scss',
})
export class TaskHistoryComponent implements OnInit {
  @Input() tarefa!: Tarefa;
  @Output() fechou = new EventEmitter<void>();
  @Output() editar = new EventEmitter<Tarefa>();

  historico = signal<HistoricoTarefa[]>([]);
  carregando = signal(true);

  readonly labelsStatus: Record<string, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    concluida: 'Concluída',
  };

  readonly labelsCampo: Record<string, string> = {
    titulo: 'Título',
    descricao: 'Descrição',
    status: 'Status',
    prioridade: 'Prioridade',
    responsavel: 'Responsável',
    dataLimite: 'Data limite',
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.obterHistorico(this.tarefa.id).subscribe({
      next: (h) => {
        this.historico.set(h);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  estaAtrasada(): boolean {
    if (!this.tarefa.dataLimite) return false;
    return (
      new Date(this.tarefa.dataLimite) < new Date() &&
      this.tarefa.status !== 'concluida'
    );
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  labelCampo(campo: string): string {
    return this.labelsCampo[campo] ?? campo;
  }

  fechar() { this.fechou.emit(); }
  abrirEdicao() { this.editar.emit(this.tarefa); }
}
