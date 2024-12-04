import { Router } from 'express';
import { AdminController } from '../controller/adminController';
// import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { validarEmail } from '../utils/validarEmailUtils';
import { validarSenha } from '../utils/validarSenhaUtils';

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.post(
  '/',
  validarEmail,
  validarSenha,
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res, next) => adminController.criarAdmin(req, res, next)
);

adminRouter.get(
  '/',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res, next) => adminController.listarAdmins(req, res, next)
);

adminRouter.get(
  '/:id',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res, next) => adminController.buscarAdminPorId(req, res, next)
);

adminRouter.put(
  '/:id',
  validarEmail,
  validarSenha,
  // authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res, next) => adminController.atualizarAdmin(req, res, next)
);

adminRouter.delete(
  '/:id',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res, next) => adminController.deletarAdmin(req, res, next)
);

export default adminRouter;
