import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../utils/jwtUtils';

const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Middleware de autenticação JWT.
 * Verifica a presença e validade do token JWT no cabeçalho de autorização.
 * Adiciona as informações do usuário ao `req.user` se o token for válido.
 *
 * @param req - Objeto da requisição HTTP.
 * @param res - Objeto da resposta HTTP.
 * @param next - Função para chamar o próximo middleware.
 * @returns Responde com 401 se o token não for fornecido ou 403 se o token for inválido.
 */
export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    req.user = {
      id: decoded.id,
      numeroMatricula: decoded.numeroMatricula,
      tipoConta: decoded.tipoConta,
      permissions: decoded.permissions
    };
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(403).json({ error: 'Token inválido.' });
  }
}

/**
 * Middleware para verificar uma permissão específica do usuário.
 * Verifica se o usuário autenticado possui uma permissão necessária para acessar a rota.
 *
 * @param permission - Permissão necessária para acessar a rota.
 * @returns Middleware que responde com 403 se o usuário não tiver a permissão.
 */
export function hasPermission(permission: string, p0: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user && user.permissions.includes(permission)) {
      next();
    } else {
      return res
        .status(403)
        .json({ error: 'Acesso negado. Permissão insuficiente.' });
    }
  };
}
