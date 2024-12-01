import express from 'express';
import { PdiController } from '../controller/pdiController';
import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { ProfessorController } from '../controller/professorController';
const pdiController = new PdiController();
const professorController = new ProfessorController();
const pdiRouter = express.Router();

pdiRouter.post(
  '/alunos/:id',
  authenticateJWT,
  hasPermission('VIEW_ALUNOS_IN_OWN_TURMAS'),
  (req, res) => pdiController.criarPdi(req, res)
);

pdiRouter.get(
  '/:id/detalhes',
  authenticateJWT,
  hasPermission('VIEW_ALUNOS_IN_OWN_TURMAS'),
  (req, res) => pdiController.obterDetalhesPDI(req, res)
);

pdiRouter.get(
  '/alunos/:id/registros',
  authenticateJWT,
  hasPermission('VIEW_ALUNOS_IN_OWN_TURMAS'),
  (req, res) => pdiController.listarPDIs(req, res)
);

pdiRouter.get(
  '/professor/turmas',
  authenticateJWT,
  hasPermission('VIEW_ALUNOS_IN_OWN_TURMAS'),
  (req, res) => professorController.professorTurmas(req, res)
);

// pdiRouter.delete('/:id', (req, res) => pdiController.deletarPDI(req, res));
export default pdiRouter;
