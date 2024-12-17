import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../utils/jwtUtils';

const SECRET_KEY = process.env.JWT_SECRET;

// Validação da chave secreta do JWT no ambiente
if (!SECRET_KEY) {
  throw new Error('JWT_SECRET não definido nas variáveis de ambiente.');
}

/**
 * Middleware de autenticação para validar tokens JWT.
 * Verifica se o token é válido e adiciona as informações do usuário no request.
 * @param req - Objeto da requisição HTTP.
 * @param res - Objeto da resposta HTTP.
 * @param next - Função para passar o controle para o próximo middleware.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Recupera o token do cabeçalho Authorization
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    // Decodifica e verifica o token JWT
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    // Atribui as informações do usuário no request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      tipoConta: decoded.tipoConta
    };
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
}
