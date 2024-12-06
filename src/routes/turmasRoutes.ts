import { TurmasController } from '../controller/turmasController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';
import { Router } from 'express';

const turmaController = new TurmasController();
const turmasRouter = Router();

turmasRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => turmaController.criarTurma(req, res)
);

turmasRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => turmaController.listarTurmas(req, res)
);

turmasRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => turmaController.buscarTurma(req, res)
);

turmasRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => turmaController.editarTurma(req, res)
);

turmasRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => turmaController.deletarTurma(req, res)
);

export default turmasRouter;
