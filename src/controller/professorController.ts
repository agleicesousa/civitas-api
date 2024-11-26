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
}
