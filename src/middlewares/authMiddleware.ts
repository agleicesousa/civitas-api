import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../utils/jwtUtils';

const SECRET_KEY = process.env.JWT_SECRET;

// Autentica o token JWT e adiciona dados ao req.user
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

// Middleware para verificar permissão específica
export function hasPermission(permission: string) {
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
