import express from 'express';
import { PdiController } from '../controller/pdiController';
import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
const pdiController = new PdiController();
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

pdiRouter.get('/', (req, res) => pdiController.listarPDIs(req, res));

// pdiRouter.delete('/:id', (req, res) => pdiController.deletarPDI(req, res));
export default pdiRouter;
