import { Request, Response } from 'express';
import { ProfessorService } from '../services/professorService';
import ErrorHandler from '../errors/errorHandler';

export class ProfessorController {
  private professorService = new ProfessorService();

  async criarProfessor(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
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
}
