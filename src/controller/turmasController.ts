import { Request, Response } from 'express';
import { TurmasService } from '../services/turmasService';

/**
 * Controlador para gerenciar as rotas relacionadas a turmas.
 */
export class TurmasController {
  private turmasService = new TurmasService();

  /**
   * Cria uma nova turma com os dados fornecidos na requisição.
   *
   * @param req - O objeto de requisição contendo os dados da nova turma.
   * @param res - O objeto de resposta para enviar de volta ao cliente.
   * @returns Uma promessa que resolve para um objeto JSON com a turma criada ou um erro, se ocorrer.
   */
  async criarTurma(req: Request, res: Response): Promise<Response> {
    try {
      const { turmaApelido, periodoLetivo, anoLetivo, ensino, adminId } =
        req.body;

      const novaTurma = await this.turmasService.criar(
        anoLetivo,
        periodoLetivo,
        ensino,
        turmaApelido,
        Number(adminId)
      );
      return res.status(201).json(novaTurma);
    } catch (error) {
      return res.status(404).json({ error: 'Erro ao criar turma' });
    }
  }

  /**
   * Lista todas as turmas cadastradas.
   *
   * @param req - O objeto de requisição. (Não utilizado atualmente)
   * @param res - O objeto de resposta para enviar de volta ao cliente.
   * @returns Uma promessa que resolve para um objeto JSON contendo todas as turmas ou um erro, se ocorrer.
   */
  async listarTurmas(req: Request, res: Response): Promise<Response> {
    try {
      const adminId = Number(req.user.id);
      const turmas = await this.turmasService.listar(adminId);
      return res.status(200).json(turmas);
    } catch (error) {
      return res.status(404).json({ error: 'Erro ao buscar turmas' });
    }
  }

  /**
   * Busca uma turma específica pelo ID.
   *
   * @param req - O objeto de requisição contendo o ID da turma.
   * @param res - O objeto de resposta para enviar de volta ao cliente.
   * @returns Uma promessa que resolve para um objeto JSON com a turma encontrada ou um erro, se ocorrer.
   */
  async buscarTurma(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const turma = await this.turmasService.buscarPorId(Number(id));
      return res.status(200).json(turma);
    } catch (error) {
      return res.status(404).json({ error: 'Erro ao buscar turma' });
    }
  }

  /**
   * Atualiza uma turma existente.
   *
   * @param req - O objeto de requisição contendo o ID da turma e os dados atualizados.
   * @param res - O objeto de resposta para enviar de volta ao cliente.
   * @returns Uma promessa que resolve para um objeto JSON com a turma atualizada ou um erro, se ocorrer.
   */
  async editarTurma(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.turmasService.editar(Number(id), req.body);
      return res.status(200).json({ message: 'Turma atualizada com sucesso' });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  /**
   * Deleta uma turma pelo ID.
   *
   * @param req - O objeto de requisição contendo o ID da turma a ser deletada.
   * @param res - O objeto de resposta para enviar de volta ao cliente.
   * @returns Uma promessa que resolve para um status de sucesso ou um erro, se ocorrer.
   */
  async deletarTurma(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.turmasService.deletar(Number(id));
      return res.status(200).json({ message: 'Turma excluída com sucesso' });
    } catch (error) {
      return res.status(404).json({ error: 'Erro ao deletar turma' });
    }
  }
}
