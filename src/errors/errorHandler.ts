import { Request, Response, NextFunction } from 'express';

/**
 * Classe para erros customizados com código de status.
 */
class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

/**
 * Middleware para tratamento de erros.
 * Responde com código de status e mensagem personalizada.
 *
 * @param err - Objeto de erro.
 * @param req - Requisição HTTP.
 * @param res - Resposta HTTP.
 * @param _next - Função para próximo middleware.
 */
export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
      error: err.stack,
    });
  }

  return res.status(500).json({
    message: 'Algo deu errado!',
    error: err.message,
  });
};

/**
 * Funções para criar erros customizados com códigos de status.
 */
export const createError = {
  badRequest: (message: string) => new CustomError(message, 400),
  unauthorized: (message: string) => new CustomError(message, 401),
  forbidden: (message: string) => new CustomError(message, 403),
  notFound: (message: string) => new CustomError(message, 404),
  internalServerError: (message: string) => new CustomError(message, 500),
};
