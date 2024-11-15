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
}
