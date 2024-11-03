import { Request, Response } from 'express';
import { AlunosService } from '../services/alunosService';

export class AlunosController {
  private alunosService = new AlunosService();
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

  async listarAlunos(req: Request, res: Response) {
    try {
      const alunos = await this.alunosService.listarAlunos();
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar alunos', error });
    }
  }

  async buscarAlunosPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const aluno = await this.alunosService.buscarAlunoPorId(Number(id));
      return res.json(aluno);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar aluno', error });
    }
  }

  async deletarAluno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.alunosService.deletarAluno(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar aluno', error });
    }
  }

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
