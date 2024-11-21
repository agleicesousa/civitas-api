/**
 * @swagger
 * tags:
 *   - name: Administradores
 *     description: Gerenciamento de administradores
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID do administrador
 *         email:
 *           type: string
 *           description: Email do administrador
 *         senha:
 *           type: string
 *           description: Senha do administrador
 *         membroId:
 *           type: integer
 *           description: ID do membro associado ao administrador
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: Data de última atualização do registro
 *       example:
 *         id: 1
 *         email: admin@example.com
 *         senha: Aa12345*
 *         membroId: 1
 *         dataCriacao: '2023-01-01T12:00:00Z'
 *         dataAtualizacao: '2023-01-10T12:00:00Z'
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Acesso negado. Token não fornecido.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Acesso negado. Token não fornecido."
 *
 *     ForbiddenError:
 *       description: Acesso negado. Permissão insuficiente ou token inválido.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Acesso negado. Permissão insuficiente."
 *
 *     ValidationError:
 *       description: Erro de validação dos dados de entrada.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: "O e-mail deve ser válido"
 *                     param:
 *                       type: string
 *                       example: "email"
 *                     location:
 *                       type: string
 *                       example: "body"
 *
 *     InternalServerError:
 *       description: Erro interno no servidor.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Algo deu errado!"
 *               error:
 *                 type: string
 *                 example: "Descrição detalhada do erro."
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Realiza o login do administrador e retorna um token JWT.
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do administrador.
 *               senha:
 *                 type: string
 *                 description: Senha do administrador.
 *             required:
 *               - email
 *               - senha
 *             example:
 *               email: admin@example.com
 *               senha: "Ab12345*"
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna o token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT.
 *               example:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Lista todos os administradores
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de administradores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Busca um administrador pelo ID
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do administrador a ser buscado
 *     responses:
 *       200:
 *         description: Administrador encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       404:
 *         description: Administrador não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "Administrador não encontrado."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Cria um novo administrador
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Atualiza um administrador pelo ID
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: Administrador atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: Administrador não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "Administrador não encontrado."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Deleta um administrador pelo ID
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do administrador
 *     responses:
 *       204:
 *         description: Administrador deletado com sucesso.
 *       403:
 *         description: Ação não permitida (tentativa de excluir o próprio administrador).
 *         content:
 *           application/json:
 *             example:
 *               error: "Você não pode excluir sua própria conta."
 *       404:
 *         description: Administrador não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "Administrador não encontrado."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

import { Router } from 'express';
import { AdminController } from '../controller/adminController';
import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { validarEmail } from '../middlewares/validarEmail';

const adminRouter = Router();
const adminController = new AdminController();

/**
 * Rota para autenticar um administrador e obter um token JWT.
 * Acesso público (não requer autenticação).
 */
adminRouter.post('/login', (req, res) => adminController.login(req, res));

/**
 * Rota para listar todos os administradores.
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
adminRouter.get(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => adminController.listarAdmins(req, res)
);

/**
 * Rota para buscar um administrador específico por ID.
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
adminRouter.get(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => adminController.buscarAdminPorId(req, res)
);

/**
 * Rota para criar um novo administrador.
 * Requer autenticação, permissão de gerenciamento de usuários e validação de e-mail.
 */
adminRouter.post(
  '/',
  validarEmail,
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => adminController.criarAdmin(req, res)
);

/**
 * Rota para atualizar um administrador existente.
 * Requer autenticação, permissão de gerenciamento de usuários.
 */
adminRouter.put(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => adminController.atualizarAdmin(req, res)
);

/**
 * Rota para deletar um administrador específico por ID.
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
adminRouter.delete(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => adminController.deletarAdmin(req, res)
);

export default adminRouter;
