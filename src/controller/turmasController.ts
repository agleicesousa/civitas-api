import { Request, Response } from 'express';
import { TurmasService } from '../services/turmasService';
import { ConflictError } from '../errors/ConflitctError';
import { getPaginationParams } from '../utils/paramsPagination';
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
      const { turmaApelido, periodoLetivo, anoLetivo, ensino } = req.body;

      const adminId = Number(req.user.id);

      const novaTurma = await this.turmasService.criar(
        anoLetivo,
        periodoLetivo,
        ensino,
        turmaApelido,
        adminId
      );
      return res
        .status(201)
        .json({ message: 'Turma criada com sucesso', turma: novaTurma });
    } catch (error) {
      if (error instanceof ConflictError) {
        return res.status(409).json({
          message: error.message
        });
      }
      return res.status(404).json({ message: 'Erro ao criar turma' });
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
    const { page, perPage } = getPaginationParams(req);
    const searchTerm = req.query.searchTerm ? String(req.query.searchTerm) : '';
    const adminId = Number(req.user.id);
    try {
      const turmas = await this.turmasService.listar(
        adminId,
        page,
        perPage,
        searchTerm
      );
      return res.status(200).json(turmas);
    } catch (error) {
      return res.status(404).json({ message: 'Erro ao buscar turmas' });
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
      return res.status(404).json({ message: 'Erro ao buscar turma' });
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
      return res.status(404).json({ message: error.message });
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
      return res.status(404).json({ message: 'Erro ao deletar turma' });
    }
  }
}
