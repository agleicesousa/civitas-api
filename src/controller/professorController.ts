import { Request, Response, NextFunction } from 'express';
import { ProfessorService } from '../services/professorService';

export class ProfessorController {
  private professorService = new ProfessorService();

  async criarProfessor(req: Request, res: Response, next: NextFunction) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw new Error('Admin não autenticado.');
      }

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
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw new Error('Admin não autenticado.');
      }

      const professores =
        await this.professorService.listarProfessores(adminLogadoId);
      res.json(professores);
    } catch (error) {
      next(error);
    }
  }

  async buscarProfessorPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw new Error('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw new Error('ID inválido.');
      }

      const professor = await this.professorService.buscarProfessorPorId(
        id,
        adminLogadoId
      );
      res.json(professor);
    } catch (error) {
      next(error);
    }
  }

  async atualizarProfessor(req: Request, res: Response, next: NextFunction) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw new Error('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw new Error('ID inválido.');
      }

      const professorAtualizado =
        await this.professorService.atualizarProfessor(
          id,
          req.body,
          adminLogadoId
        );

      res.status(200).json(professorAtualizado);
    } catch (error) {
      next(error);
    }
  }

  async deletarProfessor(req: Request, res: Response, next: NextFunction) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw new Error('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw new Error('ID inválido.');
      }

      await this.professorService.deletarProfessor(id, adminLogadoId);
      res.status(204).send('Professor excluído com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
