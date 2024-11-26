import { ProfessorController } from '../controller/professorController';
// import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { Router } from 'express';

const professorController = new ProfessorController();
const professorRouter = Router();

professorRouter.post(
  '/',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res, next) => professorController.criarProfessor(req, res, next)
);

export default professorRouter;
