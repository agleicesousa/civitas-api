import { Router } from 'express';
import { MembrosController } from '../controller/membrosController';
// import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';

const membrosRouter = Router();
const membrosController = new MembrosController();

membrosRouter.get(
  '/',
//  authenticateJWT,
//  hasPermission('VIEW_MEMBERS'),
  (req, res) => membrosController.listarMembros(req, res)
);

membrosRouter.get(
  '/:id',
//  authenticateJWT,
//  hasPermission('VIEW_MEMBERS'),
  (req, res) => membrosController.buscarMembroPorId(req, res)
);

membrosRouter.post(
  '/',
//  authenticateJWT,
//  hasPermission('MANAGE_USERS'),
  (req, res) => membrosController.criarMembro(req, res)
);

membrosRouter.put(
  '/:id',
//  authenticateJWT,
//  hasPermission('MANAGE_USERS'),
  (req, res) => membrosController.atualizarMembro(req, res)
);

membrosRouter.delete(
  '/:id',
//  authenticateJWT,
//  hasPermission('MANAGE_USERS'),
  (req, res) => membrosController.deletarMembro(req, res)
);

export default membrosRouter;
