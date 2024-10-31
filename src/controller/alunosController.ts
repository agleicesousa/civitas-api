import { Request, Response } from 'express';
import AlunosService from '../services/alunosService';

class AlunosControllerClass {
  async criarAluno(req: Request, res: Response) {
    try {
      const { turmas, membroId } = req.body;

      const novoAluno = await AlunosService.criarAluno(turmas, membroId);

      res.status(201).json(novoAluno);
    } catch (error) {
      res.status(400).json({ message: 'Erro ao criar aluno', error });
    }
  }

  async listarAlunos(req: Request, res: Response) {
    try {
      const alunos = await AlunosService.listarAlunos();
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar alunos', error });
    }
  }

  async buscarAlunosPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const aluno = await AlunosService.buscarAlunoPorId(Number(id));
      return res.json(aluno);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar aluno', error });
    }
  }

  async deletarAluno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await AlunosService.deletarAluno(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar aluno', error });
    }
  }

  async editarAluno(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const { turmas, membroId } = req.body;

      const alunoAtualizado = await AlunosService.editarAluno(
        id,
        turmas,
        membroId
      );

      return res.json(alunoAtualizado);
    } catch (error) {
      console.error('Erro ao editar professor:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

const AlunoController = new AlunosControllerClass();
export default AlunoController;
