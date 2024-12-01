import { Request, Response, NextFunction } from 'express';
import { ProfessorService } from '../services/professorService';
import ErrorHandler from '../errors/errorHandler';

export class ProfessorController {
  private professorService = new ProfessorService();

  async criarProfessor(req: Request, res: Response, next: NextFunction) {
    try {
      const adminLogadoId = req.user?.id || null;

      const novoProfessor = await this.professorService.criarProfessor(
        req.body,
        adminLogadoId
      );

      res.status(201).json(novoProfessor);
    } catch (error) {
      next(error);
    }
  }

  async listarProfessores(req: Request, res: Response, next: NextFunction) {
    try {
      const professor = await this.professorService.listarProfessores();
      res.json(professor);
    } catch (error) {
      next(error);
    }
  }

  async buscarProfessorPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const professor = await this.professorService.buscarProfessorPorId(id);
      res.json(professor);
    } catch (error) {
      next(error);
    }
  }

  async atualizarProfessor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);

      const professorAtualizado =
        await this.professorService.atualizarProfessor(id, req.body);

      res.status(200).json(professorAtualizado);
    } catch (error) {
      next(error);
    }
  }

  async deletarProfessor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);

      await this.professorService.deletarProfessor(id);
      res.status(204).send('Professor excluído com sucesso');
    } catch (error) {
      next(error);
    }
  }

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
