import { Router } from 'express';
import { MembrosController } from '../controller/membrosController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';

const membrosRouter = Router();
const membrosController = new MembrosController();

// Usando permissaoAdminMiddleware com Membros como entidade
membrosRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.criarMembro(req, res)
);

membrosRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.listarMembros(req, res)
);

membrosRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.buscarMembroPorId(req, res)
);

membrosRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.atualizarMembro(req, res)
);

membrosRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.deletarMembro(req, res)
);

export default membrosRouter;
