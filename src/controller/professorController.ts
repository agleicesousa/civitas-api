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

      const adminId = req.user.id;

      const novoProfessor = await this.professorService.criarProfessor(
        nomeMembro,
        cpf,
        new Date(dataNascimento),
        numeroMatricula,
        turmasApelido,
        membroId ? Number(membroId) : null,
        adminId
      );

      res.status(201).json(novoProfessor);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar professor', error });
    }
  }

  /**
   * Lista todos os professores criados pelo admin que está fazendo a requisição.
   *
   * @param req - A requisição HTTP.
   * @param res - A resposta HTTP para ser enviada ao cliente.
   */
  async listarProfessores(req: Request, res: Response) {
    try {
      const adminId = req.user.id;

      const professores = await this.professorService.listarProfessores(adminId);
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
      const adminId = req.user.id;

      const professor = await this.professorService.buscarProfessorPorId(
        Number(id),
        adminId // Passa o adminId para garantir que o admin que criou o professor seja o único que possa acessá-lo
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
      const adminId = req.user.id;

      await this.professorService.deletarProfessor(Number(id), adminId); // Passa o adminId para garantir que apenas o admin responsável possa deletar
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
  async editarProfessor(req: Request, res: Response): Promise < Response > {
    try {
      const id = req.params.id;
      const { turmasApelidos, membroId } = req.body;
      const adminId = req.user.id;

      const professorAtualizado = await this.professorService.editarProfessor(
        Number(id),
        turmasApelidos,
        Number(membroId),
        adminId
      );

      return res.json(professorAtualizado);
    } catch (error) {
      console.error('Erro ao editar professor:', error);
      return res.status(404).json({ error: error.message });
    }
  }
}
