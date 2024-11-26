import { Request } from 'express';

export function getPaginationParams(req: Request) {
  const page = Math.max(1, parseInt((req.query.page as string) ?? '1'));
  const perPage = parseInt((req.query.perPage as string) ?? null);
  return { page, perPage };
}
