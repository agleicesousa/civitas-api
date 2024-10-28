import { Request, Response } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response) => {
  console.error(err.stack);

  res.status(500).json({
    message: 'Algo deu errado!',
    error: err.message
  });
};
