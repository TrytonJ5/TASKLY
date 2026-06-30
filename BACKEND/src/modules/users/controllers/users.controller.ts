import { Request, Response, NextFunction } from 'express';
import { registrarSchema, loginSchema } from '../schema/users.schema.js';
import * as usersService from '../service/users.service.js';

export async function registrar(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dados = registrarSchema.parse(req.body);
    const usuario = await usersService.registrarUsuario(dados);
    res.status(201).json(usuario);
  } catch (erro) {
    next(erro);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dados = loginSchema.parse(req.body);
    const resultado = await usersService.autenticarUsuario(dados);
    res.status(200).json(resultado);
  } catch (erro) {
    next(erro);
  }
}
