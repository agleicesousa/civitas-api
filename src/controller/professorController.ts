import { Request, Response } from 'express';
import { ProfessorService } from '../services/professorService';

/**
 * Classe responsável por gerenciar as operações de controle de professores.
 */
export class ProfessorController {
  private professorService = new ProfessorService();
  /**
   * Cria um novo professor.
   *
   * @param req - O  objeto da requisão contendo os dados do professor.
   * @param res - A resposta HTTP para ser enviada ao cliente.
   */
  async criarProfessor(req: Request, res: Response) {
    try {
      const { senha, membroId, turmasApelido } = req.body;

      const novoProfessor = await this.professorService.criarProfessor(
        senha,
        Number(membroId),
        turmasApelido
      );

      res.status(201).json(novoProfessor);
    } catch (error) {
      res.status(404).json({ message: 'Erro ao criar professor', error });
    }
  }
  /**
   * Lista todos os professores.
   *
   * @param req - A requisição HTTP.
   * @param res - A resposta HTTP para ser enviada ao cliente.
   */
  async listarProfessores(req: Request, res: Response) {
    try {
      const professores = await this.professorService.listarProfessores();
      res.json(professores);
    } catch (error) {
      res.status(404).json({ message: 'Erro ao listar professores', error });
    }
  }
  /**
   * Busca um professor pelo ID.
   *
   * @param req - A requisição HTTP contendo o ID do professor.
   * @param res - A resposta HTTP para ser enviada ao cliente.
   */
  async buscarProfessorPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const professor = await this.professorService.buscarProfessorPorId(
        Number(id)
      );
      return res.json(professor);
    } catch (error) {
      return res
        .status(404)
        .json({ message: 'Erro ao buscar professor', error });
    }
  }
  /**
   * Deleta um professor pelo ID.
   *
   * @param req - A requisição HTTP contendo o ID do professor.
   * @param res - A resposta HTTP para ser enviada ao cliente.
   */
  async deletarProfessor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.professorService.deletarProfessor(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res
        .status(404)
        .json({ message: 'Erro ao deletar professor', error });
    }
  }
  /**
   * Edita os detalhes de um professor existente.
   *
   * @param req - A requisição HTTP contendo o ID do professor e os novos dados.
   * @param res - A resposta HTTP para ser enviada ao cliente.
   * @returns A resposta HTTP com o professor atualizado.
   */
  async editarProfessor(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const { turmasApelidos, senha, membroId } = req.body;

      const professorAtualizado = await this.professorService.editarProfessor(
        Number(id),
        turmasApelidos,
        senha,
        Number(membroId)
      );

      return res.json(professorAtualizado);
    } catch (error) {
      console.error('Erro ao editar professor:', error);
      return res.status(404).json({ error: error.message });
    }
  }
}
