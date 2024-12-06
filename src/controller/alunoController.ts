import { Request, Response } from 'express';
import { AlunoService } from '../services/alunoService';
import ErrorHandler from '../errors/errorHandler';

export class AlunoController {
  private alunoService = new AlunoService();

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

  async atualizarAluno(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      const alunoId = parseInt(req.params.id);

      const resultado = await this.alunoService.atualizarAluno(
        alunoId,
        req.body,
        adminLogadoId
      );

      return res
        .status(200)
        .json({ message: resultado.message, aluno: resultado.aluno });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async excluirAluno(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      const alunoId = parseInt(req.params.id);

      const resultado = await this.alunoService.excluirAluno(
        alunoId,
        adminLogadoId
      );

      return res.status(200).json({ message: resultado.message });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }
}
