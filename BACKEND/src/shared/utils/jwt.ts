import pkg from 'jsonwebtoken';

const { sign, verify } = pkg;

export interface PayloadToken {
  id: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
}

export function gerarToken(payload: PayloadToken): string {
  return sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN as any 
  });
}

export function verificarToken(token: string): PayloadToken {
  return verify(token, JWT_SECRET) as PayloadToken;
}
