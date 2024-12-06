import { Request, Response } from 'express';
import { MembrosService } from '../services/membrosService';
import ErrorHandler from '../errors/errorHandler';

export class MembrosController {
  private membrosService = new MembrosService();

  async criarMembro(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;
      if (!adminCriadorId) {
        return res.status(401).json({ error: 'Admin não logado.' });
      }

      const novoMembro = await this.membrosService.criarMembro({
        ...req.body,
        adminCriadorId
      });

      res.status(201).json({
        message: 'Membro criado com sucesso.',
        data: novoMembro
      });
    } catch (error) {
      const statusCode = error instanceof ErrorHandler ? error.statusCode : 500;
      res.status(statusCode).json({ message: error.message || 'Erro ao criar membro.' });
    }
  }

  async listarMembros(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;
      if (!adminCriadorId) {
        return res.status(401).json({ error: 'Admin não logado.' });
      }

      const membros = await this.membrosService.listarMembros(adminCriadorId);

      res.json({
        message: 'Membros listados com sucesso.',
        data: membros
      });
    } catch (error) {
      const statusCode = error instanceof ErrorHandler ? error.statusCode : 500;
      res.status(statusCode).json({ message: error.message || 'Erro ao buscar membros.' });
    }
  }

  async buscarMembroPorId(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        return res.status(400).json({ error: 'Admin não autenticado.' });
      }

      const id = req.params.id;
      const membro = await this.membrosService.buscarMembroPorId(adminCriadorId, id);

      res.json({
        message: 'Membro encontrado com sucesso.',
        data: membro
      });
    } catch (error) {
      const statusCode = error instanceof ErrorHandler ? error.statusCode : 500;
      res.status(statusCode).json({ message: error.message || 'Erro ao buscar membro.' });
    }
  }

  async atualizarMembro(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        return res.status(400).json({ error: 'Admin não autenticado.' });
      }

      const id = req.params.id;
      const membroAtualizado = await this.membrosService.atualizarMembro(adminCriadorId, id, req.body);

      res.json({
        message: 'Membro atualizado com sucesso.',
        data: membroAtualizado
      });
    } catch (error) {
      const statusCode = error instanceof ErrorHandler ? error.statusCode : 500;
      res.status(statusCode).json({ message: error.message || 'Erro ao atualizar membro.' });
    }
  }

  async deletarMembro(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        return res.status(400).json({ error: 'Admin não autenticado.' });
      }

      const id = req.params.id;
      await this.membrosService.deletarMembro(adminCriadorId, id);

      res.status(204).json({ message: 'Membro deletado com sucesso.' });
    } catch (error) {
      const statusCode = error instanceof ErrorHandler ? error.statusCode : 500;
      res.status(statusCode).json({ message: error.message || 'Erro ao deletar membro.' });
    }
  }
}
