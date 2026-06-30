import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../utils/jwt.js';
import { ApiError } from './error.middleware.js';

export interface RequestAutenticada extends Request {
  usuario?: {
    id: string;
    email: string;
  };
}

export function authMiddleware(
  req: RequestAutenticada,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Token de autenticação não informado');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError(401, 'Token de autenticação inválido ou mal formatado');
  }

  try {
    const payload = verificarToken(token);
    req.usuario = payload;
    next();
  } catch {
    throw new ApiError(401, 'Token inválido ou expirado');
  }
}
