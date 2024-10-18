import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware para autenticar usuários com base em um token JWT.
 * Verifica se o token é válido e o decodifica, adicionando os dados do
 * usuário ao req.user. Se o token for inválido, retorna um erro 403.
 * @param req - Objeto da requisi o HTTP.
 * @param res - Objeto da resposta HTTP.
 * @param next - Função de callback para passar o controle para o próximo middleware.
 */
export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];
  const SECRET_KEY = process.env.JWT_SECRET || 'ChaveSecreta';

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: number;
      tipoConta: string;
      apelido: string;
    };

    // Adiciona os dados do usuário ao req.user
    req.user = {
      id: decoded.id,
      tipoConta: decoded.tipoConta,
      apelido: decoded.apelido
    };

    next(); // Prossegue para o próximo middleware ou rota
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido.' });
  }
}
