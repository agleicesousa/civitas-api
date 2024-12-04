import { Router } from 'express';
import { LoginController } from '../controller/loginController';

const loginRoutes = Router();
const controller = new LoginController();

loginRoutes.post('/login', (req, res) => controller.login(req, res));

export default loginRoutes;
