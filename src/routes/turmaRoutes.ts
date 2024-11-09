import { TurmasController } from '../controller/turmasController';
import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { Router } from 'express';

const turmaController = new TurmasController();
const turmasRouter = Router();

turmasRouter.post(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => turmaController.criarTurma(req, res)
);

turmasRouter.get(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => turmaController.listarTurmas(req, res)
);

turmasRouter.get(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => turmaController.buscarTurma(req, res)
);

turmasRouter.put(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => turmaController.editarTurma(req, res)
);

turmasRouter.delete(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => turmaController.deletarTurma(req, res)
);

turmasRouter.get(
  '/admin/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => turmaController.buscarPorAdmin(req, res)
);

export default turmasRouter;
