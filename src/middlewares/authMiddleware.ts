import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: number;
  tipoConta: string;
  email: string;
}

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];
  const SECRET_KEY = process.env.JWT_SECRET;

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;

    // Adiciona os dados do usuário ao req.user
    req.user = {
      id: decoded.id,
      tipoConta: decoded.tipoConta,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(403).json({ error: 'Token inválido.' });
  }
}
