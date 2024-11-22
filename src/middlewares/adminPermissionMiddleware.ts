import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../config/database';

// Interface para entidades com relacionamento 'admin'
interface EntityWithAdmin {
  admin: { id: number };
}

/**
 * Middleware genérico para verificar se o admin autenticado é o mesmo que criou a entidade.
 *
 * @param entityClass - A classe da entidade que estamos verificando.
 * @param entityType - Nome da entidade para mensagens de erro.
 */
export function checkAdminPermission<T extends EntityWithAdmin>(
  entityClass: new () => T,
  entityType: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req;

      // Verifica se o usuário é um admin autenticado
      if (!user || user.tipoConta !== 'admin') {
        return res
          .status(403)
          .json({ error: 'Acesso negado. Permissão de admin necessária.' });
      }

      const entityRepository: Repository<T> = MysqlDataSource.getRepository(entityClass);

      // Busca a entidade no banco
      const entityRecord = await entityRepository.findOne(Number(id), {
        relations: ['admin'],
      });

      if (!entityRecord) {
        return res
          .status(404)
          .json({ error: `${entityType} não encontrado.` });
      }

      // Verifica se o admin autenticado criou a entidade
      if (entityRecord.admin.id !== user.id) {
        return res.status(403).json({
          error: 'Acesso negado. Você não tem permissão para gerenciar esta entidade.',
        });
      }

      // Se for válido, continua
      next();
    } catch (error) {
      console.error('Erro ao verificar permissão de admin:', error);
      res
        .status(500)
        .json({ error: 'Erro ao verificar permissão de admin.' });
    }
  };
}
