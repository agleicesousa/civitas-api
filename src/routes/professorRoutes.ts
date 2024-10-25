import { ProfessorController } from '../controller/professorController';
import { Router } from 'express';

const professorController = new ProfessorController();
const professorRouter = Router();

professorRouter.post('/', (req, res) =>
  professorController.criarProfessor(req, res)
);
professorRouter.get('/', (req, res) =>
  professorController.listarProfessores(req, res)
);

professorRouter.get('/:id', (req, res) =>
  professorController.buscarProfessorPorId(req, res)
);

professorRouter.put('/:id', (req, res) =>
  professorController.editarProfessor(req, res)
);

professorRouter.delete('/:id', (req, res) =>
  professorController.deletarProfessor(req, res)
);

export default professorRouter;
