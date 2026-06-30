import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Erros de validação do Zod (formato de e-mail, senha curta, etc.)
  if (err instanceof ZodError) {
    res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: err.issues.map((e) => ({
        campo: e.path.join('.'),
        mensagem: e.message,
      })),
    });
    return;
  }

  // Erros de negócio previstos (e-mail duplicado, credenciais inválidas, etc.)
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ erro: err.message });
    return;
  }

  // Qualquer outro erro inesperado
  console.error(err);
  res.status(500).json({ erro: 'Erro interno no servidor' });
}
