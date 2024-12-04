import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../config/database';

interface IdDoAdmin {
  admin: { id: number };
}

export function checarPermissoesAdmin<T extends IdDoAdmin>(
  entityClass: new () => T,
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

      const entityRepository: Repository<T> = MysqlDataSource.getRepository(entityClass);

      const entityRecord = await entityRepository.findOne({
        where: { id: Number(id) } as any,
        relations: ['admin'],
      });

      if (!entityRecord) {
        return res.status(404).json({ error: `${entityType} não encontrado.` });
      }

      if (entityRecord.admin.id !== user.id) {
        return res.status(403).json({
          error:
            'Acesso negado. Você não tem permissão para gerenciar esta entidade.',
        });
      }

      next();
    } catch (error) {
      console.error('Erro ao verificar permissão de admin:', error);
      res.status(500).json({ error: 'Erro ao verificar permissão de admin.' });
    }
  };
}
