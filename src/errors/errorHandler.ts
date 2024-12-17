import { Request, Response, NextFunction } from 'express';

/**
 * Classe de tratamento de erros personalizados.
 * Estende a classe padrão `Error` do JavaScript para definir erros com status HTTP.
 */
export default class ErrorHandler extends Error {
  statusCode: number;

  /**
   * Construtor da classe ErrorHandler.
   * @param message - Mensagem do erro.
   * @param statusCode - Código de status HTTP associado ao erro.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  /**
   * Retorna uma instância de ErrorHandler para erro 400 (Bad Request).
   * @param message - Mensagem de erro.
   */
  static badRequest(message: string) {
    return new ErrorHandler(message, 400);
  }

  /**
   * Retorna uma instância de ErrorHandler para erro 401 (Unauthorized).
   * @param message - Mensagem de erro.
   */
  static unauthorized(message: string) {
    return new ErrorHandler(message, 401);
  }

  /**
   * Retorna uma instância de ErrorHandler para erro 403 (Forbidden).
   * @param message - Mensagem de erro.
   */
  static forbidden(message: string) {
    return new ErrorHandler(message, 403);
  }

  /**
   * Retorna uma instância de ErrorHandler para erro 404 (Not Found).
   * @param message - Mensagem de erro.
   */
  static notFound(message: string) {
    return new ErrorHandler(message, 404);
  }

  /**
   * Retorna uma instância de ErrorHandler para erro 500 (Internal Server Error).
   * @param message - Mensagem de erro.
   */
  static internalServerError(message: string) {
    return new ErrorHandler(message, 500);
  }

  /**
   * Retorna uma instância de ErrorHandler para erro 409 (Conflict).
   * @param message - Mensagem de erro.
   */
  static conflictError(message: string) {
    return new ErrorHandler(message, 409);
  }
}

/**
 * Middleware global para tratamento de erros na aplicação Express.
 * @param err - Objeto de erro capturado.
 * @param req - Objeto de requisição HTTP.
 * @param res - Objeto de resposta HTTP.
 * @param _next - Função para passar o controle para o próximo middleware (não utilizada aqui).
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack);

  // Caso o erro seja uma instância de ErrorHandler, responde com seu statusCode e mensagem.
  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // Caso o erro não seja uma instância de ErrorHandler, responde com erro 500.
  return res.status(500).json({
    message: 'Algo deu errado. Por favor, tente novamente mais tarde.'
  });
};
