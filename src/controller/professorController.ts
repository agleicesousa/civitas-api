import { Request, Response, NextFunction } from 'express';
import { ProfessorService } from '../services/professorService';

export class ProfessorController {
  private professorService = new ProfessorService();

  /**
   * Cria um novo professor.
   */
  async criarProfessor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

  /**
   * Lista todos os professores.
   */
  async listarProfessores(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const professores = await this.professorService.listarProfessores();
      res.status(200).json(professores);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca um professor pelo ID.
   */
  async buscarProfessorPorId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = this.validarId(req.params.id);
      const professor = await this.professorService.buscarProfessorPorId(id);

      if (!professor) {
        res.status(404).json({ message: 'Professor não encontrado' });
        return;
      }

      res.status(200).json(professor);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza os dados de um professor.
   */
  async atualizarProfessor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = this.validarId(req.params.id);

      const professorAtualizado =
        await this.professorService.atualizarProfessor(id, req.body);

      if (!professorAtualizado) {
        res.status(404).json({ message: 'Professor não encontrado' });
        return;
      }

      res.status(200).json(professorAtualizado);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deleta um professor pelo ID.
   */
  async deletarProfessor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = this.validarId(req.params.id);

      const deletado = await this.professorService.deletarProfessor(id);

      if (!deletado) {
        res.status(404).json({ message: 'Professor não encontrado' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Valida o ID do parâmetro da requisição.
   */
  private validarId(idParam: string): number {
    const id = parseInt(idParam, 10);
    if (isNaN(id) || id <= 0) {
      throw new Error('ID inválido');
    }
    return id;
  }
}
