import { MembrosService } from '../services/membrosService';
import { Request, Response } from 'express';

/**
 * Controlador responsável por gerenciar operações relacionadas a membros.
 */
export class MembrosController {
  private membrosService = new MembrosService();

  /**
   * Lista todos os membros.
   * @param req - Objeto da requisição HTTP.
   * @param res - Objeto da resposta HTTP.
   * @returns Retorna a lista de membros em formato JSON.
   */
  async listarMembros(req: Request, res: Response) {
    try {
      const membros = await this.membrosService.listarMembros();
      res.json(membros);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar membros' });
    }
  }

  /**
   * Busca um membro específico pelo ID.
   * @param req - Objeto da requisição HTTP, contendo o ID do membro nos parâmetros.
   * @param res - Objeto da resposta HTTP.
   * @returns Retorna o membro correspondente ao ID, ou uma mensagem de erro se não encontrado.
   */
  async buscarMembroPorId(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const idNumber = Number(id);

      if (isNaN(idNumber)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const membro = await this.membrosService.buscarMembroPorId(id);
      if (membro) {
        res.json(membro);
      } else {
        res.status(404).json({ error: 'Membro não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar membro' });
    }
  }

  /**
   * Cria um novo membro.
   * @param req - Objeto da requisição HTTP, contendo os dados do novo membro no corpo da requisição.
   * @param res - Objeto da resposta HTTP.
   * @returns Retorna o membro criado em formato JSON.
   */
  async criarMembro(req: Request, res: Response) {
    try {
      const novoMembro = await this.membrosService.criarMembro(req.body);
      res.status(201).json(novoMembro);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar membro' });
    }
  }

  /**
   * Atualiza um membro existente.
   * @param req - Objeto da requisição HTTP, contendo o ID do membro nos parâmetros e os dados atualizados no corpo.
   * @param res - Objeto da resposta HTTP.
   * @returns Retorna o membro atualizado em formato JSON.
   */
  async atualizarMembro(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membroAtualizado = await this.membrosService.atualizarMembro(
        id,
        req.body
      );
      res.json(membroAtualizado);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar membro' });
    }
  }

  /**
   * Deleta um membro existente.
   * @param req - Objeto da requisição HTTP, contendo o ID do membro nos parâmetros.
   * @param res - Objeto da resposta HTTP.
   * @returns Retorna uma resposta sem conteúdo (204) se o membro for deletado com sucesso.
   */
  async deletarMembro(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.membrosService.deletarMembro(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar membro' });
    }
  }
}
