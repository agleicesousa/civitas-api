import { Request, Response, NextFunction } from 'express';

/**
 * Classe personalizada para tratamento de erros com código de status.
 */
export default class ErrorHandler extends Error {
  statusCode: number;

  /**
   * Constrói um novo objeto de erro com mensagem e código de status.
   * @param message Mensagem do erro.
   * @param statusCode Código de status HTTP.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  /**
   * Retorna um erro de requisição inválida (400).
   * @param message Mensagem do erro.
   */
  static badRequest(message: string) {
    return new ErrorHandler(message, 400);
  }

  /**
   * Retorna um erro de não autorizado (401).
   * @param message Mensagem do erro.
   */
  static unauthorized(message: string) {
    return new ErrorHandler(message, 401);
  }

  /**
   * Retorna um erro de acesso proibido (403).
   * @param message Mensagem do erro.
   */
  static forbidden(message: string) {
    return new ErrorHandler(message, 403);
  }

  /**
   * Retorna um erro de recurso não encontrado (404).
   * @param message Mensagem do erro.
   */
  static notFound(message: string) {
    return new ErrorHandler(message, 404);
  }

  /**
   * Retorna um erro de servidor interno (500).
   * @param message Mensagem do erro.
   */
  static internalServerError(message: string) {
    return new ErrorHandler(message, 500);
  }

  /**
   * Retorna um erro de conflito (409).
   * @param message - Mensagem descrevendo o conflito.
   * @returns Uma instância de ErrorHandler com status 409.
   */
  static conflictError(message: string) {
    return new ErrorHandler(message, 409);
  }
}

/**
 * Middleware de tratamento de erros.
 * Responde com erro genérico 500 em caso de falha.
 * @param err Objeto de erro.
 * @param req Objeto da requisição HTTP.
 * @param res Objeto da resposta HTTP.
 * @param _next Função para chamar o próximo middleware (não utilizado).
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack);

  res.status(err instanceof ErrorHandler ? err.statusCode : 500).json({
    message: err.message || 'Algo deu errado!',
    error: err.message
  });
};
