import { Request } from 'express';

export const getPaginacao = (req: Request) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;

  return { page, perPage };
};
