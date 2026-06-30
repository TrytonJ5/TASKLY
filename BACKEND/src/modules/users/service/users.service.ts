import bcrypt from 'bcryptjs';
import { ApiError } from '../../../shared/middlewares/error.middleware.js';
import { gerarToken } from '../../../shared/utils/jwt.js';
import * as usersRepository from '../repositories/users.repository.js';
import { RegistrarDTO, LoginDTO } from '../schema/users.schema.js';

const SALT_ROUNDS = 10;

export async function registrarUsuario(dados: RegistrarDTO) {
  const usuarioExistente = await usersRepository.buscarPorEmail(dados.email);

  if (usuarioExistente) {
    throw new ApiError(409, 'Este e-mail já está cadastrado');
  }

  const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

  const usuario = await usersRepository.criar({
    nome: dados.nome,
    email: dados.email,
    senhaHash,
  });

  // Nunca devolver o hash da senha na resposta da API
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

export async function autenticarUsuario(dados: LoginDTO) {
  const usuario = await usersRepository.buscarPorEmail(dados.email);

  if (!usuario) {
    throw new ApiError(401, 'E-mail ou senha inválidos');
  }

  const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senhaHash);

  if (!senhaCorreta) {
    throw new ApiError(401, 'E-mail ou senha inválidos');
  }

  const token = gerarToken({ id: usuario.id, email: usuario.email });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
  };
}
