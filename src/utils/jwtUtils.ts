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

export function gerarToken(payload: {
  id: number;
  numeroMatricula: string;
  tipoConta: string;
}): string {
  const permissions = permissionsByRole[payload.tipoConta] || [];
  return jwt.sign({ ...payload, permissions }, SECRET_KEY, { expiresIn: '1d' });
}

export const verificarToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
};
