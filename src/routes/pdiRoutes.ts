import express from 'express';
import { PdiController } from '../controller/pdiController';
import { ProfessorController } from '../controller/professorController';
import { TurmasController } from '../controller/turmasController';
import { authMiddleware } from '../middlewares/authMiddleware';
const pdiController = new PdiController();
const professorController = new ProfessorController();
const turmasController = new TurmasController();
const pdiRouter = express.Router();

pdiRouter.post('/alunos/:id', authMiddleware, (req, res) =>
  pdiController.criarPdi(req, res)
);

pdiRouter.get('/:id/detalhes', authMiddleware, (req, res) =>
  pdiController.obterDetalhesPDI(req, res)
);

pdiRouter.get('/alunos/:id/dados', authMiddleware, (req, res) =>
  pdiController.obterResumoProfessorAluno(req, res)
);

pdiRouter.get('/alunos/:id/registros', authMiddleware, (req, res) =>
  pdiController.listarPDIsDoAluno(req, res)
);

pdiRouter.get('/professor/turmas', authMiddleware, (req, res) =>
  professorController.professorTurmas(req, res)
);

pdiRouter.get('/professor/turmas/:id/alunos', (req, res) =>
  turmasController.buscarAlunosTurma(req, res)
);

pdiRouter.delete('/:id', (req, res) => pdiController.deletarPDI(req, res));
export default pdiRouter;
