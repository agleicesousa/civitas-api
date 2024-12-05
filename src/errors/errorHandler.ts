import { Request, Response, NextFunction } from 'express';

export default class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  static badRequest(message: string) {
    return new ErrorHandler(message, 400);
  }

  static unauthorized(message: string) {
    return new ErrorHandler(message, 401);
  }

  static forbidden(message: string) {
    return new ErrorHandler(message, 403);
  }

  static notFound(message: string) {
    return new ErrorHandler(message, 404);
  }

  static internalServerError(message: string) {
    return new ErrorHandler(message, 500);
  }

  static conflictError(message: string) {
    return new ErrorHandler(message, 409);
  }
}

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
