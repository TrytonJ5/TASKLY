import { prisma } from '../../../shared/infra/prisma/client.js';

export function buscarPorEmail(email: string) {
  return prisma.usuario.findUnique({ where: { email } });
}

export function criar(dados: { nome: string; email: string; senhaHash: string }) {
  return prisma.usuario.create({ data: dados });
}
