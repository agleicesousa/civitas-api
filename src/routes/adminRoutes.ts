import { Router } from 'express';
import { AdminController } from '../controller/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => adminController.criarAdmin(req, res, next)
);

adminRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => adminController.listarAdmins(req, res, next)
);

adminRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => adminController.buscarAdminPorId(req, res, next)
);

adminRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => adminController.atualizarAdmin(req, res, next)
);

adminRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => adminController.deletarAdmin(req, res, next)
);

export default adminRouter;
