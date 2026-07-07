import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../envoriment/environment';
import { AuthResponse, LoginDTO, RegistrarDTO, Usuario } from '../../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'taskly_token';
  private readonly USUARIO_KEY = 'taskly_usuario';

  // Signal reativo: qualquer componente que ler `usuario()` atualiza
  // automaticamente quando o valor mudar (login/logout)
  private _usuario = signal<Usuario | null>(this.carregarUsuarioSalvo());

  readonly usuario = this._usuario.asReadonly();
  readonly estaLogado = computed(() => this._usuario() !== null);

  constructor(private http: HttpClient, private router: Router) {}

  registrar(dados: RegistrarDTO) {
    return this.http.post(`${environment.apiUrl}/auth/registrar`, dados);
  }

  login(dados: LoginDTO) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, dados)
      .pipe(
        tap((resposta) => {
          localStorage.setItem(this.TOKEN_KEY, resposta.token);
          localStorage.setItem(
            this.USUARIO_KEY,
            JSON.stringify(resposta.usuario)
          );
          this._usuario.set(resposta.usuario);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USUARIO_KEY);
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  obterToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private carregarUsuarioSalvo(): Usuario | null {
    const salvo = localStorage.getItem(this.USUARIO_KEY);
    return salvo ? (JSON.parse(salvo) as Usuario) : null;
  }
}
