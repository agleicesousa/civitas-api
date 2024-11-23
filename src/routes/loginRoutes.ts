import { Router } from 'express';
import { loginController } from '../controller/loginController';

const loginRoutes = Router();
const controller = new loginController();

loginRoutes.post('/login', (req, res) => controller.login(req, res));

export default loginRoutes;
