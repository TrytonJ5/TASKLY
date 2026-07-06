import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const logado = authService.estaLogado();
  console.log('--- TESTE DO GUARD ---');
  console.log('O AuthService diz que está logado?', logado);

  if (logado) {
    console.log('Guard deu permissão. Carregando componente...');
    return true;
  }

  console.log('Guard barrou! Redirecionando para /login...');
  router.navigate(['/login']);
  return false;
};