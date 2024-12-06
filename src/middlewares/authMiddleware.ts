import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../utils/jwtUtils';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET não definido nas variáveis de ambiente.');
}

export async function authMiddleware(
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
      email: decoded.email,
      tipoConta: decoded.tipoConta,
      permissions: decoded.permissions
    };
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
}

export function permissoes(necessaria: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = req.user;
    if (usuario?.permissions?.includes(necessaria)) {
      return next();
    }
    return res.status(403).json({
      error: 'Acesso negado. Permissão insuficiente.'
    });
  };
}
