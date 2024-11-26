import { Request, Response, NextFunction } from 'express';
import { ProfessorService } from '../services/professorService';

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
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
