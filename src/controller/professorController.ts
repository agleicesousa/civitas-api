import { Request, Response } from 'express';
import { ProfessorService } from '../services/professorService';
import { AppError } from '../utils/appError';

/**
 * Controlador para gerenciar os professores.
 */
export class ProfessorController {
  private professorService = new ProfessorService();

  /**
   * Cria um novo professor e o associa ao admin que está criando.
   */
  async criarProfessor(req: Request, res: Response) {
    const {
      nomeMembro,
      cpf,
      dataNascimento,
      numeroMatricula,
      turmasApelido,
    } = req.body;
    const adminId = req.user.id;

    try {
      const professor = await this.professorService.criarProfessor(
        nomeMembro,
        cpf,
        dataNascimento,
        numeroMatricula,
        turmasApelido,
        adminId
      );
      return res.status(201).json(professor);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Lista todos os professores associados ao admin autenticado.
   */
  async listarProfessores(req: Request, res: Response) {
    const adminId = req.user.id;

    try {
      const professores = await this.professorService.listarProfessores(adminId);
      return res.status(200).json(professores);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Busca um professor pelo ID, somente se o admin que está fazendo a requisição for o mesmo que o criou.
   */
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
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Edita os dados de um professor, somente se o admin que está fazendo a requisição for o mesmo que o criou.
   */
  async editarProfessor(req: Request, res: Response) {
    const professorId = parseInt(req.params.id);
    const adminId = req.user.id;
    const { turmasApelido, membroId } = req.body;

    try {
      const professor = await this.professorService.editarProfessor(
        professorId,
        adminId,
        turmasApelido,
        membroId
      );
      return res.status(200).json(professor);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Deleta um professor, somente se o admin que está fazendo a requisição for o mesmo que o criou.
   */
  async deletarProfessor(req: Request, res: Response) {
    const professorId = parseInt(req.params.id);
    const adminId = req.user.id;

    try {
      await this.professorService.deletarProfessor(professorId, adminId);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}