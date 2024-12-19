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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login do usuário.
 *     description: Realiza o login de um usuário verificando credenciais e retornando token.
 *     tags:
 *       - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               senha:
 *                 type: string
 *                 example: "senha123"
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
 *                   example: "token_jwt"
 *                 tipoConta:
 *                   type: string
 *                   example: "admin"
 *                 primeiroLogin:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: E-mail e senha são obrigatórios.
 *       401:
 *         description: E-mail ou senha incorretos.
 */

/**
 * @swagger
 * /primeiro-login:
 *   post:
 *     summary: Atualiza a senha do usuário no primeiro login.
 *     description: Atualiza a senha de um usuário no caso de primeiro login.
 *     tags:
 *       - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novaSenha
 *             properties:
 *               novaSenha:
 *                 type: string
 *                 example: "novaSenha123"
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso.
 *       400:
 *         description: Nova senha é obrigatória.
 */

/**
 * @swagger
 * /solicitar-recuperacao:
 *   post:
 *     summary: Solicita recuperação de senha.
 *     description: Envia um token de recuperação para o e-mail do usuário.
 *     tags:
 *       - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *     responses:
 *       200:
 *         description: Link de recuperação enviado para o e-mail.
 *       400:
 *         description: E-mail é obrigatório.
 */

/**
 * @swagger
 * /resetar-senha:
 *   post:
 *     summary: Redefine a senha através do token de recuperação.
 *     description: Utiliza o token de recuperação para redefinir a senha.
 *     tags:
 *       - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - novaSenha
 *             properties:
 *               token:
 *                 type: string
 *                 example: "token_recuperacao"
 *               novaSenha:
 *                 type: string
 *                 example: "novaSenha123"
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso.
 *       400:
 *         description: A nova senha deve ser informada.
 *       401:
 *         description: Token inválido ou expirado.
 */
