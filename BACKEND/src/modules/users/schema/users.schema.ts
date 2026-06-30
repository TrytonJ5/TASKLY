import { z } from 'zod';

export const registrarSchema = z
  .object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.email({ message: 'E-mail inválido'}),
    senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  });

export const loginSchema = z.object({
  email: z.email({ message: 'E-mail inválido'}),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export type RegistrarDTO = z.infer<typeof registrarSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
