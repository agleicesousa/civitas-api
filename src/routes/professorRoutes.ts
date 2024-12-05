import { Router } from 'express';
import { ProfessorController } from '../controller/professorController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';

const professorController = new ProfessorController();
const professorRouter = Router();

professorRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => professorController.criarProfessor(req, res, next)
);

professorRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => professorController.listarProfessores(req, res, next)
);

professorRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => professorController.buscarProfessorPorId(req, res, next)
);

professorRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => professorController.atualizarProfessor(req, res, next)
);

professorRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => professorController.deletarProfessor(req, res, next)
);

export default professorRouter;
