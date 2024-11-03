import { Request, Response } from 'express';
import { AlunosService } from '../services/alunosService';

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
      const novoAluno = await this.alunosService.criarAluno(
        nomeCompleto,
        rg,
        numeroMatricula,
        Number(turmaId),
        responsavelCpf
      );

      res.status(201).json(novoAluno);
    } catch (error) {
      res.status(400).json({ message: 'Erro ao criar aluno', error });
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
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar alunos', error });
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
      return res.status(500).json({ message: 'Erro ao buscar aluno', error });
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
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar aluno', error });
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
      console.error('Erro ao editar professor:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}
