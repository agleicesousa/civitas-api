import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET_KEY = process.env.JWT_SECRET;

export interface JwtPayload {
  id: number;
  numeroMatricula: string;
  tipoConta: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

// Mapeamento das permissões por tipo de conta
const permissionsByRole = {
  admin: [
    'MANAGE_USERS',
    'VIEW_MEMBERS',
    'VIEW_RESPONSAVEIS',
    'VIEW_ALUNOS',
    'MANAGE_ATIVIDADES'
  ],
  // professor: ['VIEW_ALUNOS', 'MANAGE_OWN_ATIVIDADES'],
  responsavel: ['VIEW_OWN_CHILD_ATIVIDADES']
};

/**
 * Gera um token JWT para um usuário com base no payload fornecido.
 * Inclui permissões de acordo com o tipo de conta do usuário.
 *
 * @param payload - Dados do usuário, incluindo `id`, `numeroMatricula` e `tipoConta`.
 * @returns O token JWT gerado como uma string.
 */
export function gerarToken(payload: {
  id: number;
  numeroMatricula: string;
  tipoConta: string;
}): string {
  const permissions = permissionsByRole[payload.tipoConta] || [];
  return jwt.sign({ ...payload, permissions }, SECRET_KEY, { expiresIn: '1d' });
}

/**
 * Verifica a validade de um token JWT.
 * Decodifica o token e retorna o payload se o token for válido.
 *
 * @param token - Token JWT a ser verificado.
 * @returns O payload decodificado do token.
 * @throws {Error} Se o token for inválido ou expirado.
 */
export const verificarToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
};
