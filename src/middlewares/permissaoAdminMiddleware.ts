import { Request, Response, NextFunction } from 'express';
import { Repository, EntityTarget } from 'typeorm';
import { MysqlDataSource } from '../config/database';

interface EntityWithId {
  id: number;
  adminCriadorId: number;
}

export function permissaoAdminMiddleware<T extends EntityWithId>(
  entityClass: EntityTarget<T>, // Usamos EntityTarget para garantir a tipagem correta
  entityType: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      if (!user || user.tipoConta !== 'admin') {
        return res
          .status(403)
          .json({ error: 'Acesso negado. Permissão de admin necessária.' });
      }

      if (req.method === 'POST') {
        return next();
      }

      const { id } = req.params;

      const entityRepository: Repository<T> =
        MysqlDataSource.getRepository(entityClass);

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
