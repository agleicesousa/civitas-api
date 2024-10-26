import { Request, Response, NextFunction } from 'express';

/**
 * Verifica se o usuário é um administrador.
 * Se o usuário for um administrador, passa o controle para o próximo middleware.
 * Se o usuário não for um administrador, retorna um erro de acesso negado.
 *
 * @param req - Objeto da requisição HTTP.
 * @param res - Objeto da resposta HTTP.
 * @param next - Função de callback para passar o controle para o próximo middleware.
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as { tipoConta: string };

  if (user.tipoConta === 'admin') {
    next();
  } else {
    return res.status(403).json({
      error:
        'Acesso negado. Apenas administradores podem realizar essa operação.'
    });
  }
}
