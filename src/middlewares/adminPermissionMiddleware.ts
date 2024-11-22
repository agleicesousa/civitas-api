import { Request, Response, NextFunction } from 'express';
import { Repository, getRepository } from 'typeorm';

/**
 * Middleware genérico para verificar se o admin autenticado é o mesmo que criou a entidade.
 *
 * @param entityClass - A classe da entidade que estamos verificando.
 * @param entityType - Nome da entidade para mensagens de erro.
 */
export function checkAdminPermission < T > (
  entityClass: new() => T,
  entityType: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req;

      if (!user || user.tipoConta !== 'admin') {
        return res
          .status(403)
          .json({ error: 'Acesso negado. Permissão de admin necessária.' });
      }

      const entityRepository: Repository < T > = getRepository(entityClass);

      const entityRecord = await entityRepository.findOne(id, {
        relations: ['admin'],
      });

      if (!entityRecord) {
        return res
          .status(404)
          .json({ error: `${entityType} não encontrado.` });
      }

      // Verificar se o admin que criou a entidade é o admin autenticado
      if ((entityRecord as any).admin.id !== user.id) {
        return res
          .status(403)
          .json({
            error: 'Acesso negado. Você não tem permissão para gerenciar esta entidade.',
          });
      }

      // Se o admin for o mesmo que criou, permite continuar
      next();
    } catch (error) {
      console.error('Erro ao verificar permissão de admin:', error);
      res
        .status(500)
        .json({ error: 'Erro ao verificar permissão de admin.' });
    }
  };
}
