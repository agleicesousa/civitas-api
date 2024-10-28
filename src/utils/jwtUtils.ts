import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET_KEY = process.env.JWT_SECRET;

export interface JwtPayload {
  id: number;
  email: string;
  tipoConta: string;
  iat?: number;
  exp?: number;
}

/**
 * Gera um token JWT com base no payload informado.
 * @param payload - O payload com informações do usuário a serem incluídas no token.
 * @returns O token JWT gerado.
 */
export function gerarToken(payload: {
  id: number;
  email: string;
  tipoConta: string;
}): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
}

/**
 * Verifica a validade de um token JWT.
 * @param token - O token JWT a ser verificado.
 * @returns O payload decodificado do token se for válido.
 * @throws {Error} Se o token for inválido ou expirado.
 */
export const verificarToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
};
