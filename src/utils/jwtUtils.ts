import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET não definido nas variáveis de ambiente.');
}

export interface JwtPayload {
  id: number;
  email: string;
  tipoConta: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

const permissoesPorFuncao: Record<string, string[]> = {
  admin: ['MANAGE_USERS', 'MANAGE_TURMAS'],
  professor: ['VIEW_OWN_TURMAS', 'VIEW_ALUNOS_IN_OWN_TURMAS'],
  aluno: ['VIEW_OWN_PDI']
};

export function gerarToken(payload: {
  id: number;
  email: string;
  tipoConta: string;
}): string {
  const permissions = permissoesPorFuncao[payload.tipoConta] || [];
  return jwt.sign({ ...payload, permissions }, SECRET_KEY, { expiresIn: '1d' });
}

export function verificarToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado.');
    }
    throw new Error('Token inválido.');
  }
}
