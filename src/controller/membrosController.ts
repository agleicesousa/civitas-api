import { Request, Response } from 'express';
import { MembrosService } from '../services/membrosService';

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
        adminCriadorId: adminCriadorId
      });

      res.status(201).json(novoMembro);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Erro ao criar membro', error: error.message });
    }
  }

  async listarMembros(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;
      if (!adminCriadorId) {
        return res.status(401).json({ error: 'Admin não logado.' });
      }

      const membros = await this.membrosService.listarMembros(adminCriadorId);

      res.json(membros);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Erro ao buscar membros', error: error.message });
    }
  }

  async buscarMembroPorId(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        return res.status(400).json({ error: 'Admin não autenticado.' });
      }

      const id = req.params.id;

      const membro = await this.membrosService.buscarMembroPorId(
        adminCriadorId,
        id
      );
      res.json(membro);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Erro ao buscar membro', error: error.message });
    }
  }

  async atualizarMembro(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        return res.status(400).json({ error: 'Admin não autenticado.' });
      }

      const id = req.params.id;

      const membroAtualizado = await this.membrosService.atualizarMembro(
        adminCriadorId,
        id,
        req.body
      );
      res.json(membroAtualizado);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Erro ao atualizar membro', error: error.message });
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
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Erro ao deletar membro', error: error.message });
    }
  }
}
