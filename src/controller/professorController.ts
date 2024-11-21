import { Request, Response } from 'express';
import { ProfessorService } from '../services/professorService';
import ErrorHandler from '../errors/errorHandler';

export class ProfessorController {
  private professorService = new ProfessorService();

  async criarProfessor(req: Request, res: Response) {
    const {
      nomeMembro,
      cpf,
      dataNascimento,
      numeroMatricula,
      turmasApelido,
      email,
      senha,
      turmaIds
    } = req.body;
    const adminId = req.user.id;

    try {
      const professor = await this.professorService.criarProfessor(
        nomeMembro,
        cpf,
        dataNascimento,
        numeroMatricula,
        turmasApelido,
        email,
        senha,
        adminId,
        turmaIds
      );
      return res.status(201).json(professor);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async listarProfessores(req: Request, res: Response) {
    const adminId = req.user.id;

    try {
      const professores =
        await this.professorService.listarProfessores(adminId);
      return res.status(200).json(professores);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async buscarProfessorPorId(req: Request, res: Response) {
    const professorId = parseInt(req.params.id);
    const adminId = req.user.id;

    try {
      const professor = await this.professorService.buscarProfessorPorId(
        professorId,
        adminId
      );
      return res.status(200).json(professor);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async editarProfessor(req: Request, res: Response) {
    const professorId = parseInt(req.params.id);
    const adminId = req.user.id;
    const { email, senha, turmaIds } = req.body;

    try {
      const professor = await this.professorService.editarProfessor(
        professorId,
        adminId,
        email,
        senha,
        turmaIds
      );
      return res.status(200).json(professor);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async deletarProfessor(req: Request, res: Response) {
    const professorId = parseInt(req.params.id);
    const adminId = req.user.id;

    try {
      await this.professorService.deletarProfessor(professorId, adminId);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}
