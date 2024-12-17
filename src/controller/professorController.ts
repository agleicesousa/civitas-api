import { Request, Response } from 'express';
import { ProfessorService } from '../services/professorService';
import ErrorHandler from '../errors/errorHandler';

/**
 * Controller responsável por gerenciar as operações relacionadas a professores.
 * Contém endpoints para criar, listar, buscar, atualizar e excluir professores,
 * bem como buscar as turmas associadas a um professor.
 */
export class ProfessorController {
  private professorService = new ProfessorService();

  /**
   * Cria um novo professor no sistema.
   * Apenas administradores autenticados têm permissão para criar um professor.
   *
   * @async
   * @param req - Objeto da requisição Express contendo dados do novo professor no corpo.
   * @param res - Objeto da resposta Express.
   * @returns {Promise<Response>} Mensagem de sucesso e dados do professor criado.
   * @throws {ErrorHandler.unauthorized} Caso o usuário não esteja autenticado.
   */
  async criarProfessor(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Usuário não autenticado.');
      }

      const resultado = await this.professorService.criarProfessor(
        req.body,
        adminLogadoId
      );

      res
        .status(200)
        .json({ message: resultado.message, professor: resultado.professor });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: 'Erro ao cadastrar professor', error: error.message });
    }
  }

  /**
   * Lista todos os professores criados por um administrador específico.
   *
   * @async
   * @param req - Objeto da requisição Express.
   * @param res - Objeto da resposta Express.
   * @returns {Promise<Response>} Lista com todos os professores.
   * @throws {ErrorHandler.unauthorized} Caso o usuário não esteja autenticado.
   */
  async listarProfessores(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const professores =
        await this.professorService.listarProfessores(adminLogadoId);
      res.status(200).json(professores);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: 'Erro ao listar professores', error: error.message });
    }
  }

  /**
   * Lista professores com paginação e busca por um termo específico.
   * Permite ao administrador buscar professores com filtros de pesquisa.
   *
   * @async
   * @param req - Objeto da requisição Express contendo parâmetros de paginação e busca.
   * @param res - Objeto da resposta Express.
   * @returns {Promise<Response>} Lista paginada de professores.
   * @throws {ErrorHandler} Caso haja erro interno ou falha na busca.
   */
  async listarProfessoresPagina(req: Request, res: Response) {
    try {
      const { page, perPage } = req.query;
      const searchTerm = req.query.searchTerm ?? '';
      const adminLogadoId = req.user?.id;

      const resultado = await this.professorService.listarProfessoresPagina(
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
        .json({ message: 'Erro ao listar professores', error: error.message });
    }
  }

  /**
   * Busca um professor pelo seu ID.
   * Apenas administradores autenticados têm permissão para buscar um professor.
   *
   * @async
   * @param req - Objeto da requisição Express contendo o ID do professor nos parâmetros.
   * @param res - Objeto da resposta Express.
   * @returns {Promise<Response>} Dados do professor buscado.
   * @throws {ErrorHandler.unauthorized} Caso o usuário não esteja autenticado.
   * @throws {ErrorHandler.badRequest} Caso o ID seja inválido.
   */
  async buscarProfessorPorId(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw ErrorHandler.badRequest('ID inválido.');
      }

      const professor = await this.professorService.buscarProfessorPorId(
        id,
        adminLogadoId
      );

      res.status(200).json(professor);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: 'Erro buscar professor', error: error.message });
    }
  }

  /**
   * Atualiza os dados de um professor específico.
   * Apenas administradores autenticados têm permissão para atualizar dados de professores.
   *
   * @async
   * @param req - Objeto da requisição Express contendo dados para atualização.
   * @param res - Objeto da resposta Express.
   * @returns {Promise<Response>} Mensagem de sucesso e dados do professor atualizado.
   * @throws {ErrorHandler.unauthorized} Caso o usuário não esteja autenticado.
   * @throws {ErrorHandler.badRequest} Caso o ID seja inválido.
   */
  async atualizarProfessor(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw ErrorHandler.badRequest('ID inválido.');
      }

      const resultado = await this.professorService.atualizarProfessor(
        id,
        req.body,
        adminLogadoId
      );

      res
        .status(200)
        .json({ message: resultado.message, professor: resultado.professor });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: 'Erro ao atualizar professor', error: error.message });
    }
  }

  /**
   * Deleta um professor do sistema.
   * Apenas administradores autenticados têm permissão para realizar essa operação.
   *
   * @async
   * @param req - Objeto da requisição Express contendo o ID nos parâmetros.
   * @param res - Objeto da resposta Express.
   * @returns {Promise<Response>} Mensagem de sucesso ao excluir o professor.
   */
  async deletarProfessor(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw ErrorHandler.badRequest('ID inválido.');
      }

      const resultado = await this.professorService.deletarProfessor(
        id,
        adminLogadoId
      );

      res.status(200).json(resultado);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: 'Erro ao excluir professor', error: error.message });
    }
  }

  /**
   * Recupera as turmas associadas ao professor atualmente autenticado.
   *
   * @async
   * @param req - Objeto da requisição Express.
   * @param res - Objeto da resposta Express.
   * @returns {Promise<Response>} Lista de turmas do professor.
   */
  async professorTurmas(req: Request, res: Response) {
    try {
      const professorId = req.user?.id;

      if (!professorId) {
        return res.status(400).json({ message: 'Usuário não identificado' });
      }

      const turmas =
        await this.professorService.buscarProfessorTurmas(professorId);

      return res.status(200).json(turmas);
    } catch (error) {
      console.error(error);

      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'Não foi possível carregar as turmas. Erro interno do servidor'
      });
    }
  }
}
