import { AlunosController } from '../controller/alunosController';
import { Router } from 'express';

const alunoRouter = Router();
const alunosController = new AlunosController();

alunoRouter.post('/', (req, res) => alunosController.criarAluno(req, res));
alunoRouter.get('/', (req, res) => alunosController.listarAlunos(req, res));

alunoRouter.get('/:id', (req, res) =>
  alunosController.buscarAlunosPorId(req, res)
);

alunoRouter.put('/:id', (req, res) => alunosController.editarAluno(req, res));

alunoRouter.delete('/:id', (req, res) =>
  alunosController.deletarAluno(req, res)
);

export default alunoRouter;
