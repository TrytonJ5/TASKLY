import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../core/services/task.service';
import { Tarefa } from '../../../../models';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
})
export class TaskModalComponent implements OnInit {
  @Input() tarefa: Tarefa | null = null; // null = modo criação, Tarefa = edição
  @Output() fechou = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();

  form!: FormGroup;
  carregando = signal(false);
  erro = signal('');

  get modoEdicao() { return !!this.tarefa; }
  get titulo() { return this.modoEdicao ? 'Editar tarefa' : 'Nova tarefa'; }

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  ngOnInit() {
    this.form = this.fb.group({
      titulo: [this.tarefa?.titulo ?? '', [Validators.required, Validators.minLength(3)]],
      descricao: [this.tarefa?.descricao ?? ''],
      status: [this.tarefa?.status ?? 'pendente', Validators.required],
      prioridade: [this.tarefa?.prioridade ?? 'media', Validators.required],
      responsavel: [this.tarefa?.responsavel ?? ''],
      dataLimite: [this.tarefa?.dataLimite
        ? this.tarefa.dataLimite.substring(0, 10)
        : ''],
    });
  }

  fechar() { this.fechou.emit(); }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.erro.set('');

    const dados = this.form.value;
    // Transforma string vazia de data em undefined (não enviado)
    if (!dados.dataLimite) delete dados.dataLimite;

    const operacao = this.modoEdicao
      ? this.taskService.atualizar(this.tarefa!.id, dados)
      : this.taskService.criar(dados);

    operacao.subscribe({
      next: () => {
        this.salvo.emit();
        this.fechar();
      },
      error: (err) => {
        this.erro.set(err.error?.erro ?? 'Erro ao salvar. Tente novamente.');
        this.carregando.set(false);
      },
    });
  }
}
