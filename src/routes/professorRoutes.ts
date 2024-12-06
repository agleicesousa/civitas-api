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
  (req, res) => professorController.criarProfessor(req, res)
);

professorRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.listarProfessores(req, res)
);

professorRouter.get(
  '/paginado',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.listarProfessoresPagina(req, res)
);

professorRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.buscarProfessorPorId(req, res)
);

professorRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.atualizarProfessor(req, res)
);

professorRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.deletarProfessor(req, res)
);

export default professorRouter;
