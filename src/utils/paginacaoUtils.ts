import { Request } from 'express';

/**
 * Obtém os parâmetros de paginação a partir da requisição HTTP.
 *
 * A função lê os parâmetros `page` e `perPage` da query string da requisição,
 * fornecendo valores padrão caso não sejam informados.
 *
 * @param req - Objeto da requisição Express que contém os parâmetros de consulta.
 * @returns Um objeto contendo `page` (número da página) e `perPage` (número de itens por página).
 */
export const getPaginacao = (req: Request) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;

  return { page, perPage };
};
