import { Router } from 'express';
import { AdminController } from '../controller/adminController';
// import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { validarEmail } from '../middlewares/validarEmail';

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.get(
  '/',
//  authenticateJWT,
//  hasPermission('MANAGE_USERS'),
  (req, res) => adminController.listarAdmins(req, res)
);

adminRouter.get(
  '/:id',
//  authenticateJWT,
//  hasPermission('MANAGE_USERS'),
  (req, res) => adminController.buscarAdminPorId(req, res)
);

adminRouter.post(
  '/',
  validarEmail,
//  authenticateJWT,
//  hasPermission('MANAGE_USERS'),
  (req, res) => adminController.criarAdmin(req, res)
);

adminRouter.put(
  '/:id',
// authenticateJWT,
//  hasPermission('MANAGE_USERS'),
  (req, res) => adminController.atualizarAdmin(req, res)
);

adminRouter.delete(
  '/:id',
//  authenticateJWT,
//  hasPermission('MANAGE_USERS'),
  (req, res) => adminController.deletarAdmin(req, res)
);

export default adminRouter;
