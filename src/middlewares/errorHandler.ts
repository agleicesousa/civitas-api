import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de tratamento de erros.
 * Captura erros não tratados e envia uma resposta com código de status 500.
 *
 * @param err - Objeto de erro capturado.
 * @param req - Objeto da requisição HTTP.
 * @param res - Objeto da resposta HTTP.
 * @param _next - Função para chamar o próximo middleware (não utilizado).
 * @returns Responde com uma mensagem de erro e a descrição do erro.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack);

  res.status(500).json({
    message: 'Algo deu errado!',
    error: err.message
  });
};
