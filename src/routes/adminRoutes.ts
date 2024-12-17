import { Router } from 'express';
import { AdminController } from '../controller/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { validarSenha } from '../utils/validarSenhaUtils';
import { Membros } from '../entities/membrosEntities';

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.post(
  '/',
  validarSenha,
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => adminController.criarAdmin(req, res)
);

adminRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => adminController.listarAdmins(req, res)
);

adminRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => adminController.buscarAdminPorId(req, res)
);

adminRouter.put(
  '/:id',
  validarSenha,
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => adminController.atualizarAdmin(req, res)
);

adminRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => adminController.deletarAdmin(req, res)
);

export default adminRouter;
