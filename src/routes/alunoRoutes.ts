import AlunoController from '../controller/alunosController';
import { Router } from 'express';

const alunoRouter = Router();

alunoRouter.post('/', (req, res) => AlunoController.criarAluno(req, res));
alunoRouter.get('/', (req, res) => AlunoController.listarAlunos(req, res));

alunoRouter.get('/:id', (req, res) =>
  AlunoController.buscarAlunosPorId(req, res)
);

alunoRouter.put('/:id', (req, res) => AlunoController.editarAluno(req, res));

alunoRouter.delete('/:id', (req, res) =>
  AlunoController.deletarAluno(req, res)
);

export default alunoRouter;
