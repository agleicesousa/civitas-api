import { Request, Response } from 'express';
import { TurmasService } from '../services/turmasService';
import { getPaginacao } from '../utils/paginacaoUtils';
import ErrorHandler from '../errors/errorHandler';

/**
 * Controller responsável pelo gerenciamento de turmas.
 * Contém métodos para criar, listar, buscar, editar, excluir e buscar alunos de turmas.
 */
export class TurmasController {
  private turmasService = new TurmasService();

  /**
   * Cria uma nova turma.
   *
   * @param req - Objeto Request contendo as informações da turma no body.
   * @param res - Objeto Response usado para retornar a resposta ao cliente.
   * @returns Retorna um objeto JSON com a mensagem de sucesso e os dados da turma criada.
   */
  async criarTurma(req: Request, res: Response): Promise<Response> {
    try {
      const { turmaApelido, periodoLetivo, anoLetivo, ensino } = req.body;

      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        throw ErrorHandler.unauthorized('Usuário não autenticado.');
      }

      const novaTurma = await this.turmasService.criar(
        anoLetivo,
        periodoLetivo,
        ensino,
        turmaApelido,
        adminCriadorId
      );
      return res
        .status(201)
        .json({ message: 'Turma criada com sucesso', turma: novaTurma });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      return res
        .status(500)
        .json({ error: error.message, message: 'Erro ao criar turma' });
    }
  }

  /**
   * Lista turmas paginadas com base em um termo de busca.
   *
   * @param req - Objeto Request contendo os parâmetros de paginação e busca.
   * @param res - Objeto Response usado para retornar a resposta ao cliente.
   * @returns Retorna uma lista de turmas paginadas.
   */
  async listarTurmas(req: Request, res: Response): Promise<Response> {
    const { page, perPage } = getPaginacao(req);
    const searchTerm = req.query.searchTerm ? String(req.query.searchTerm) : '';
    const adminCriadorId = req.user?.id;

    if (!adminCriadorId) {
      throw ErrorHandler.unauthorized('Admin não autenticado.');
    }

    try {
      const { data, total } = await this.turmasService.listar(
        adminCriadorId,
        page,
        perPage,
        searchTerm
      );
      return res.status(200).json({ page, perPage, total, data });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message, message: 'Erro ao listar turmas' });
    }
  }

  /**
   * Busca uma turma específica pelo ID.
   *
   * @param req - Objeto Request contendo o ID da turma nos parâmetros.
   * @param res - Objeto Response usado para retornar a resposta ao cliente.
   * @returns Retorna os detalhes da turma encontrada.
   */
  async buscarTurmaId(req: Request, res: Response): Promise<Response> {
    try {
      const turmaId = Number(req.params.id);
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        throw ErrorHandler.unauthorized('Usuário não autenticado.');
      }

      if (!turmaId) {
        return res.status(400).json({
          message: 'O ID da turma é inválido.'
        });
      }

      const turma = await this.turmasService.buscarTurmaPorId(
        turmaId,
        adminCriadorId
      );

      return res.status(200).json({
        message: 'Turma encontrada com sucesso.',
        turma
      });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'Erro ao buscar turma. Erro interno do servidor.'
      });
    }
  }

  /**
   * Edita os dados de uma turma existente.
   *
   * @param req - Objeto Request contendo o ID da turma nos parâmetros e os dados a serem atualizados no body.
   * @param res - Objeto Response usado para retornar a resposta ao cliente.
   * @returns Retorna uma mensagem de sucesso após a edição.
   */
  async editarTurma(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      await this.turmasService.editar(Number(id), req.body, adminCriadorId);

      return res.status(200).json({ message: 'Turma atualizada com sucesso' });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ error: error.message, message: 'Erro ao editar turma' });
    }
  }

  /**
   * Deleta uma turma específica pelo ID.
   *
   * @param req - Objeto Request contendo o ID da turma nos parâmetros.
   * @param res - Objeto Response usado para retornar a resposta ao cliente.
   * @returns Retorna uma mensagem de sucesso após a exclusão.
   */
  async deletarTurma(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      await this.turmasService.deletar(Number(id), adminCriadorId);

      return res.status(200).json({ message: 'Turma excluída com sucesso' });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ error: error.message, message: 'Erro ao excluir turma' });
    }
  }

  /**
   * Busca todos os alunos associados a uma turma específica.
   *
   * @param req - Objeto Request contendo o ID da turma nos parâmetros.
   * @param res - Objeto Response usado para retornar a resposta ao cliente.
   * @returns Retorna uma lista de alunos da turma.
   */
  async buscarAlunosTurma(req: Request, res: Response): Promise<Response> {
    try {
      const turmaId = Number(req.params.id);

      if (!turmaId) {
        return res.status(400).json({
          message: 'O ID da turma é inválido.'
        });
      }

      const alunos = await this.turmasService.buscarAlunosPorTurma(
        Number(turmaId)
      );

      return res.status(200).json({
        message: 'Alunos da turma encontrados com sucesso.',
        alunos
      });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      return res.status(500).json({
        message: 'Não foi possível carregar os alunos. Erro interno do servidor'
      });
    }
  }
}
