import { ProfessorController } from '../controller/professorController';
import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { Router } from 'express';

const professorController = new ProfessorController();
const professorRouter = Router();

professorRouter.post(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => professorController.criarProfessor(req, res)
);
professorRouter.get(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => professorController.listarProfessores(req, res)
);

professorRouter.get(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => professorController.buscarProfessorPorId(req, res)
);

professorRouter.put(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => professorController.editarProfessor(req, res)
);

professorRouter.delete(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => professorController.deletarProfessor(req, res)
);

export default professorRouter;
