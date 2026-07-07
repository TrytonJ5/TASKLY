import { Component, signal, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  carregando = signal(false);
  erro = signal('');
  aviso = signal(''); // mensagens de contexto (sessão expirada, cadastro ok)

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    // Lê query params pra exibir avisos contextuais
    this.route.queryParams.subscribe((params) => {
      if (params['sessaoExpirada']) {
        this.aviso.set('Sua sessão expirou. Faça login novamente.');
      }
      if (params['cadastrado']) {
        this.aviso.set('Conta criada com sucesso! Faça login para continuar.');
      }
    });
  }

  get email() { return this.form.get('email'); }
  get senha() { return this.form.get('senha'); }

  entrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.erro.set('');
    this.aviso.set('');

    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.erro.set(err.error?.erro ?? 'Erro ao entrar. Tente novamente.');
        this.carregando.set(false);
      },
    });
  }
}
