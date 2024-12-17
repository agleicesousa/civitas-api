import jwt from 'jsonwebtoken';
import 'dotenv/config';
import crypto from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET não definido nas variáveis de ambiente.');
}

export interface JwtPayload {
  id: number;
  email: string;
  tipoConta: string;
  iat?: number;
  exp?: number;
}

export function gerarToken(payload: {
  id: number;
  email: string;
  tipoConta: string;
}): string {
  return jwt.sign({ ...payload }, SECRET_KEY, { expiresIn: '1d' });
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

export function gerarTokenRecuperacao(): string {
  return crypto.randomBytes(32).toString('hex');
}
