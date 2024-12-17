import jwt from 'jsonwebtoken';
import 'dotenv/config';
import crypto from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET não definido nas variáveis de ambiente.');
}

/**
 * Interface que representa a estrutura esperada para o payload do JWT.
 */
export interface JwtPayload {
  id: number; // ID do usuário autenticado.
  email: string; // Email do usuário.
  tipoConta: string; // Tipo de conta do usuário (admin, professor, aluno, etc).
  iat?: number; // Data de emissão do token (opcional).
  exp?: number; // Data de expiração do token (opcional).
}

/**
 * Gera um token JWT assinado com as informações do payload.
 *
 * @param payload - Dados necessários para gerar o token (id, email, tipoConta).
 * @returns Token JWT assinado como string.
 */
export function gerarToken(payload: {
  id: number;
  email: string;
  tipoConta: string;
}): string {
  return jwt.sign({ ...payload }, SECRET_KEY, { expiresIn: '1d' });
}

/**
 * Verifica a validade de um token JWT.
 *
 * @param token - Token JWT a ser verificado.
 * @returns O payload do token caso seja válido.
 * @throws Erro caso o token esteja expirado ou inválido.
 */
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

/**
 * Gera um token de recuperação seguro para ações de recuperação de senha ou autenticação temporária.
 *
 * @returns Uma string segura, representando um token criptograficamente aleatório.
 */
export function gerarTokenRecuperacao(): string {
  return crypto.randomBytes(32).toString('hex');
}
