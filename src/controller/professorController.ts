import { Request, Response } from 'express';
import { ProfessorService } from '../services/professorService';

/**
 * Classe responsável por gerenciar as operações de controle de professores.
 */
export class ProfessorController {
  private professorService = new ProfessorService();

  /**
   * Cria um novo professor.
   * @param req - O objeto da requisição contendo os dados do professor.
   * @param res - A resposta HTTP para ser enviada ao cliente.
   */
  async criarProfessor(req: Request, res: Response) {
    try {
      const {
        nomeMembro,
        cpf,
        dataNascimento,
        numeroMatricula,
        turmasApelido,
        membroId
      } = req.body;

      const novoProfessor = await this.professorService.criarProfessor(
        nomeMembro,
        cpf,
        new Date(dataNascimento),
        numeroMatricula,
        turmasApelido,
        membroId ? Number(membroId) : null
      );

      res.status(201).json(novoProfessor);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar professor', error });
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
      return res
        .status(200)
        .json({ message: 'Professor excluído com sucesso' });
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
      const { turmasApelidos, membroId } = req.body;

      await this.professorService.editarProfessor(
        Number(id),
        turmasApelidos,
        Number(membroId)
      );

      return res
        .status(200)
        .json({ message: 'Professor atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao editar professor:', error);
      return res.status(404).json({ error: error.message });
    }
  }
}
