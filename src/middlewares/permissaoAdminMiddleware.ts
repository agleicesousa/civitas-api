import { Request, Response, NextFunction } from 'express';
import { Repository, EntityTarget } from 'typeorm';
import { MysqlDataSource } from '../config/database';

interface EntityWithId {
  id: number;
  adminCriadorId: number;
}

/**
 * Middleware para verificar permissões de administrador.
 * Garante que apenas usuários com tipo de conta 'admin' possam acessar determinadas operações.
 *
 * @param entityClass - Classe da entidade que será manipulada pelo middleware.
 * @param entityType - Nome da entidade (string) para mensagens de erro mais claras.
 * @returns Middleware para Express.
 */
export function permissaoAdminMiddleware<T extends EntityWithId>(
  entityClass: EntityTarget<T>,
  entityType: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      // Verificação de permissão: apenas administradores têm acesso
      if (!user || user.tipoConta !== 'admin') {
        return res
          .status(403)
          .json({ error: 'Acesso negado. Permissão de admin necessária.' });
      }

      // Se a requisição for POST, prossegue sem verificações adicionais
      if (req.method === 'POST') {
        return next();
      }

      const { id } = req.params;

      // Caso a requisição seja GET e não tenha ID, prossegue sem verificações
      if (req.method === 'GET' && !id) {
        return next();
      }

      const entityRepository: Repository<T> =
        MysqlDataSource.getRepository(entityClass);

      // Caso não tenha um ID, busca todas as entidades pertencentes ao admin
      if (!id) {
        const entityRecords = await entityRepository
          .createQueryBuilder('entity')
          .where('entity.adminCriadorId = :adminCriadorId', {
            adminCriadorId: user.id
          })
          .getMany();

        if (entityRecords.length === 0) {
          return res
            .status(404)
            .json({ error: `Nenhum ${entityType} encontrado.` });
        }

        return res.status(200).json(entityRecords);
      }

      const idNumber = Number(id);
      if (isNaN(idNumber)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      // Verificação da existência da entidade específica
      const entityRecord = await entityRepository
        .createQueryBuilder('entity')
        .where('entity.id = :id AND entity.adminCriadorId = :adminCriadorId', {
          id: idNumber,
          adminCriadorId: user.id
        })
        .getOne();

      if (!entityRecord) {
        return res.status(404).json({ error: `${entityType} não encontrado.` });
      }

      next();
    } catch (error) {
      console.error('Erro ao verificar permissão de admin:', error);
      res.status(500).json({ error: 'Erro ao verificar permissão de admin.' });
    }
  };
}
