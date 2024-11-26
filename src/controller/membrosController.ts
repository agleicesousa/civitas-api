import { Request, Response } from 'express';
import { MembrosService } from '../services/membrosService';

export class MembrosController {
  private membrosService = new MembrosService();

  async listarMembros(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user.id;
      const membros = await this.membrosService.listarMembros(adminCriadorId);
      res.json(membros);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar membros' });
    }
  }

  async buscarMembroPorId(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user.id;
      const id = req.params.id;

      const membro = await this.membrosService.buscarMembroPorId(
        adminCriadorId,
        id
      );
      if (membro) {
        res.json(membro);
      } else {
        res.status(404).json({ error: 'Membro não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar membro' });
    }
  }

  async criarMembro(req: Request, res: Response) {
    try {
      const novoMembro = await this.membrosService.criarMembro(req.body);
      res.status(201).json(novoMembro);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Erro ao criar membro', error: error.message });
    }
  }

  async atualizarMembro(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user.id;
      const id = req.params.id;

      const membroAtualizado = await this.membrosService.atualizarMembro(
        adminCriadorId,
        id,
        req.body
      );
      res.json(membroAtualizado);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar membro' });
    }
  }

  async deletarMembro(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user.id;
      const id = req.params.id;

      await this.membrosService.deletarMembro(adminCriadorId, id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar membro' });
    }
  }
}
