import { Request, Response } from 'express';
import { AlunoService } from '../services/alunoService';
import ErrorHandler from '../errors/errorHandler';

/**
 * Controlador responsável por gerenciar as requisições relacionadas a Alunos.
 */
export class AlunoController {
  private alunoService = new AlunoService();

  /**
   * Cria um novo aluno no sistema.
   * @param req - Objeto da requisição contendo os dados do aluno no corpo.
   * @param res - Objeto da resposta usado para retornar o resultado.
   * @returns Resposta com status 201 e os dados do aluno cadastrado.
   */
  async criarAluno(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const resultado = await this.alunoService.criarAluno(
        req.body,
        adminLogadoId
      );

      return res
        .status(201)
        .json({ message: resultado.message, aluno: resultado.aluno });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: 'Erro ao cadastrar aluno', error: error.message });
    }
  }

  /**
   * Lista os alunos de forma paginada e opcionalmente filtra por termo de busca.
   * @param req - Objeto da requisição contendo parâmetros de paginação e busca.
   * @param res - Objeto da resposta usado para retornar a lista de alunos.
   * @returns Resposta com status 200 contendo lista de alunos paginada.
   */
  async listarAlunos(req: Request, res: Response) {
    try {
      const { page, perPage } = req.query;
      const searchTerm = req.query.searchTerm ?? '';
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const resultado = await this.alunoService.listarAlunos(
        Number(page) || 1,
        Number(perPage) || 10,
        searchTerm as string,
        adminLogadoId
      );

      return res.status(200).json({
        message: resultado.message,
        page,
        perPage,
        total: resultado.total,
        data: resultado.data
      });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  /**
   * Lista todos os alunos vinculados ao administrador logado.
   * @param req - Objeto da requisição.
   * @param res - Objeto da resposta usado para retornar a lista de alunos.
   * @returns Resposta com status 200 contendo a lista completa de alunos.
   */
  async listarAlunosCompleto(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const alunos =
        await this.alunoService.listarAlunosCompleto(adminLogadoId);
      res.status(200).json(alunos);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: 'Erro ao listar alunos', error: error.message });
    }
  }

  /**
   * Busca os detalhes de um aluno específico pelo ID.
   * @param req - Objeto da requisição contendo o ID do aluno nos parâmetros.
   * @param res - Objeto da resposta usado para retornar os dados do aluno.
   * @returns Resposta com status 200 contendo os dados do aluno.
   */
  async buscarAlunoPorId(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw ErrorHandler.badRequest('ID inválido.');
      }

      const aluno = await this.alunoService.buscarAlunoPorId(id, adminLogadoId);

      res.status(200).json(aluno);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: 'Erro buscar aluno', error: error.message });
    }
  }

  /**
   * Atualiza os dados de um aluno específico.
   * @param req - Objeto da requisição contendo os novos dados no corpo e o ID nos parâmetros.
   * @param res - Objeto da resposta usado para retornar o resultado da atualização.
   * @returns Resposta com status 200 e os dados atualizados do aluno.
   */
  async atualizarAluno(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw ErrorHandler.badRequest('ID inválido.');
      }

      const resultado = await this.alunoService.atualizarAluno(
        id,
        req.body,
        adminLogadoId
      );

      res
        .status(200)
        .json({ message: resultado.message, aluno: resultado.aluno });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: 'Erro ao atualizar aluno', error: error.message });
    }
  }

  /**
   * Exclui um aluno do sistema pelo ID.
   * @param req - Objeto da requisição contendo o ID do aluno nos parâmetros.
   * @param res - Objeto da resposta usado para retornar a confirmação de exclusão.
   * @returns Resposta com status 200 confirmando a exclusão do aluno.
   */
  async excluirAluno(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const alunoId = parseInt(req.params.id);

      if (isNaN(alunoId)) {
        throw ErrorHandler.badRequest('ID inválido.');
      }

      const resultado = await this.alunoService.excluirAluno(
        alunoId,
        adminLogadoId
      );

      return res.status(200).json({ message: resultado.message });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: 'Erro ao excluir aluno', error: error.message });
    }
  }
}
