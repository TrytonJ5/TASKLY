import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { Tarefa, DashboardContadores, FiltrosTarefa } from '../../models';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { TaskHistoryComponent } from './components/task-history/task-history.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskModalComponent, TaskHistoryComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  tarefas = signal<Tarefa[]>([]);
  contadores = signal<DashboardContadores>({ pendentes: 0, concluidas: 0, atrasadas: 0 });
  carregando = signal(true);

  // Modais
  modalAberto = signal(false);
  tarefaEmEdicao = signal<Tarefa | null>(null);
  tarefaHistorico = signal<Tarefa | null>(null);

  // Filtros
  filtros: FiltrosTarefa = {};
  buscaTexto = '';
  private busca$ = new Subject<string>();

  readonly usuario = computed(() => this.authService.usuario());

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.carregarDados();

    // Busca textual com debounce: só dispara após 350ms sem digitar
    this.busca$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((busca) => {
          this.filtros = { ...this.filtros, busca: busca || undefined };
          return this.taskService.listar(this.filtros);
        })
      )
      .subscribe((tarefas) => this.tarefas.set(tarefas));
  }

  carregarDados() {
    this.carregando.set(true);
    this.taskService.listar(this.filtros).subscribe({
      next: (t) => { this.tarefas.set(t); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
    this.taskService.obterContadores().subscribe((c) => this.contadores.set(c));
  }

  aplicarFiltro(chave: keyof FiltrosTarefa, valor: string) {
    this.filtros = { ...this.filtros, [chave]: valor || undefined };
    this.carregarTarefas();
  }

  onBusca(valor: string) {
    this.busca$.next(valor);
  }

  carregarTarefas() {
    this.taskService.listar(this.filtros).subscribe((t) => this.tarefas.set(t));
  }

  abrirModalCriacao() {
    this.tarefaEmEdicao.set(null);
    this.modalAberto.set(true);
  }

  abrirModalEdicao(tarefa: Tarefa) {
    this.tarefaEmEdicao.set(tarefa);
    this.modalAberto.set(true);
    this.tarefaHistorico.set(null); // Fecha histórico se estiver aberto
  }

  fecharModal() { this.modalAberto.set(false); }

  abrirHistorico(tarefa: Tarefa) { this.tarefaHistorico.set(tarefa); }
  fecharHistorico() { this.tarefaHistorico.set(null); }

  aoSalvar() {
    this.carregarDados();
  }

  confirmarExclusao(tarefa: Tarefa) {
    if (!confirm(`Excluir "${tarefa.titulo}"? Essa ação não pode ser desfeita.`)) return;

    this.taskService.remover(tarefa.id).subscribe({
      next: () => this.carregarDados(),
      error: () => alert('Erro ao excluir tarefa.'),
    });
  }

  estaAtrasada(tarefa: Tarefa): boolean {
    if (!tarefa.dataLimite) return false;
    return new Date(tarefa.dataLimite) < new Date() && tarefa.status !== 'concluida';
  }

  labelStatus(status: string): string {
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      em_andamento: 'Em andamento',
      concluida: 'Concluída',
    };
    return labels[status] ?? status;
  }

  logout() { this.authService.logout(); }
}
