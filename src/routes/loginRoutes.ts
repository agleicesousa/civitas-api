import { Router } from 'express';
import { LoginController } from '../controller/loginController';

const loginRoutes = Router();
const controller = new LoginController();

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Autenticação e gerenciamento de login
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 format: password
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticação
 *       400:
 *         description: Erro na requisição (dados inválidos).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada
 *       401:
 *         description: Credenciais inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada
 */
loginRoutes.post('/login', (req, res) => controller.login(req, res));

export default loginRoutes;
