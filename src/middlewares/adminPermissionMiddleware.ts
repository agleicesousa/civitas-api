import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

/**
 * Middleware genérico que verifica se o admin autenticado é o responsável por gerenciar um recurso.
 * 
 * @param resourceRepository - Repositório da entidade que será verificada (ex: Professor, Aluno, etc.).
 * @param resourceName - Nome do recurso sendo gerido (ex: "professor", "aluno").
 * @returns Middleware que verifica a permissão do admin para gerenciar o recurso.
 */
export const checkAdminPermission = (resourceRepository: any, resourceName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const resource = await resourceRepository.findOne(id);

      if (!resource) {
        return res.status(404).json({ error: `${resourceName} não encontrado.` });
      }

      if (resource.admin.id !== userId) {
        return res.status(403).json({ error: 'Permissão negada.' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao verificar permissão.' });
    }
  };
}