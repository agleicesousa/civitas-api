import { Request, Response } from 'express';
import { AlunosService } from '../services/alunosService';
import { ConflictError } from '../errors/ConflitctError';
import { NotFoundError } from '../errors/NotFoundError';

export class AlunosController {
  private alunosService = new AlunosService();

  /**
   * Cria um novo aluno com os dados fornecidos no corpo da requisição.
   *
   * @param req - A requisição contendo os dados do novo aluno.
   * @param res - A resposta a ser enviada ao cliente.
   */
  async criarAluno(req: Request, res: Response) {
    try {
      const { nomeCompleto, rg, numeroMatricula, turmaId, responsavelCpf } =
        req.body;
      await this.alunosService.criarAluno(
        nomeCompleto,
        rg,
        numeroMatricula,
        Number(turmaId),
        responsavelCpf
      );

      return res.status(201).json({
        message: 'Estudante criado com sucesso'
      });
    } catch (error) {
      if (error instanceof ConflictError) {
        return res.status(409).json({ message: error.message });
      }
      return res.status(400).json({ message: 'Erro ao criar aluno', error });
    }
  }

  /**
   * Lista todos os alunos, incluindo suas turmas, membros e responsáveis.
   *
   * @param req - A requisição do cliente.
   * @param res - A resposta a ser enviada ao cliente com a lista de alunos.
   */
  async listarAlunos(req: Request, res: Response) {
    try {
      const alunos = await this.alunosService.listarAlunos();
      return res.status(200).json(alunos);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao listar alunos', error });
    }
  }

  /**
   * Busca um aluno pelo ID fornecido nos parâmetros da requisição.
   *
   * @param req - A requisição do cliente contendo o ID do aluno.
   * @param res - A resposta a ser enviada ao cliente com o aluno encontrado.
   */
  async buscarAlunosPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const aluno = await this.alunosService.buscarAlunoPorId(Number(id));
      return res.json(aluno);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro ao listar alunos', error });
    }
  }
  /**
   * Deleta um aluno pelo ID fornecido nos parâmetros da requisição.
   *
   * @param req - A requisição do cliente contendo o ID do aluno a ser deletado.
   * @param res - A resposta a ser enviada ao cliente após a deleção.
   */
  async deletarAluno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.alunosService.deletarAluno(Number(id));
      return res.status(204).json({ message: 'Aluno excluído com sucesso' });
    } catch (error) {
      console.error('Caught error:', error);
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor', error });
    }
  }
  /**
   * Edita as informações de um aluno existente com os dados fornecidos no corpo da requisição.
   *
   * @param req - A requisição do cliente contendo o ID do aluno e os novos dados.
   * @param res - A resposta a ser enviada ao cliente com o aluno atualizado.
   */
  async editarAluno(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const { turmaId, rg, nomeCompleto, numeroMatricula, responsavelCpf } =
        req.body;

      const alunoAtualizado = await this.alunosService.editarAluno(
        id,
        nomeCompleto,
        rg,
        numeroMatricula,
        Number(turmaId),
        responsavelCpf
      );

      return res.json(alunoAtualizado);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
