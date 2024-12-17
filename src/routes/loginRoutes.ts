import { Router } from 'express';
import { LoginController } from '../controller/loginController';
import { authMiddleware } from '../middlewares/authMiddleware';

const loginRoutes = Router();
const controller = new LoginController();

loginRoutes.post('/login', (req, res) => controller.login(req, res));

loginRoutes.post('/primeiro-login', authMiddleware, (req, res) =>
  controller.atualizarSenhaPrimeiroLogin(req, res)
);

loginRoutes.post('/solicitar-recuperacao', (req, res) =>
  controller.solicitarRecuperacao(req, res)
);

loginRoutes.post('/resetar-senha', (req, res) =>
  controller.resetarSenha(req, res)
);

export default loginRoutes;
