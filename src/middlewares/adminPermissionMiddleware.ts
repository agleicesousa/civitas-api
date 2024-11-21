import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Professor } from '../entities/professoresEntities';

/**
 * Middleware genérico para verificar se o admin autenticado é o mesmo que criou o usuário.
 *
 * @param entity - A entidade que estamos verificando.
 * @param entityType - Tipo da entidade que estamos verificando
 */
export async function checkAdminPermission(entity: any, entityType: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req;

      if (!user || user.tipoConta !== 'admin') {
        return res
          .status(403)
          .json({ error: 'Acesso negado. Permissão de admin necessária.' });
      }

      // Obter o objeto da entidade pelo ID
      const entityRepository = getRepository(entity);
      const entityRecord = await entityRepository.findOne(id);

      if (!entityRecord) {
        return res.status(404).json({ error: `${entityType} não encontrado.` });
      }

      // Verificar se o admin que criou a entidade é o admin autenticado
      if (entityRecord.admin.id !== user.id) {
        return res.status(403).json({
          error: 'Acesso negado. Você não pode gerenciar este professor.'
        });
      }

      // Se o admin for o mesmo que criou, permite continuar
      next();
    } catch (error) {
      console.error('Erro ao verificar permissão de admin:', error);
      res.status(500).json({ error: 'Erro ao verificar permissão de admin.' });
    }
  };
}
