/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do administrador
 *           example: 1
 *         apelido:
 *           type: string
 *           description: Apelido do administrador
 *           example: admin123
 *         email:
 *           type: string
 *           description: Email do administrador
 *           example: admin@example.com
 *         membro:
 *           type: object
 *           description: Membro associado ao administrador
 *           properties:
 *             id:
 *               type: integer
 *               description: ID do membro
 *               example: 1
 *             nome:
 *               type: string
 *               description: Nome do membro
 *               example: João Silva
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do administrador adicionada automaticamente
 *           example: '2023-10-21T12:34:56Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de última atualização do administrador adicionada automaticamente
 *           example: '2023-10-22T15:45:30Z'
 *
 * tags:
 *   - name: Administradores
 *     description: Operações de gerenciamento de administradores
 */

/**
 * @swagger
 * paths:
 *   /admin/login:
 *     post:
 *       summary: Autentica um administrador e retorna um token JWT
 *       tags: [Administradores]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - senha
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Email ou apelido do administrador
 *                   example: admin@example.com
 *                 senha:
 *                   type: string
 *                   description: Senha do administrador
 *                   example: Ab12345*
 *       responses:
 *         200:
 *           description: Login bem-sucedido, retorna o token JWT
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     description: Token JWT para autenticação
 *                     example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         401:
 *           description: Credenciais inválidas
 *           content:
 *             application/json:
 *               example:
 *                 message: Credenciais inválidas
 *
 *   /admin:
 *     get:
 *       summary: Lista todos os administradores
 *       tags: [Administradores]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Lista de administradores
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Admin'
 *               example:
 *                 - id: 1
 *                   apelido: admin123
 *                   email: admin@example.com
 *                   membro:
 *                     id: 1
 *                     nome: João Silva
 *                   createdAt: '2023-10-21T12:34:56Z'
 *                   updatedAt: '2023-10-22T15:45:30Z'
 *         401:
 *           description: Token de autenticação não fornecido ou inválido
 *           content:
 *             application/json:
 *               example:
 *                 message: Token de autenticação não fornecido ou inválido
 *         403:
 *           description: Acesso negado (não autorizado)
 *           content:
 *             application/json:
 *               example:
 *                 message: Acesso negado
 *     post:
 *       summary: Cria um novo administrador
 *       tags: [Administradores]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - apelido
 *                 - email
 *                 - senha
 *                 - membroId
 *               properties:
 *                 apelido:
 *                   type: string
 *                   description: Apelido do administrador
 *                   example: admin123
 *                 email:
 *                   type: string
 *                   description: Email do administrador
 *                   example: admin@example.com
 *                 senha:
 *                   type: string
 *                   description: Senha do administrador
 *                   example: Ab12345*
 *                 membroId:
 *                   type: integer
 *                   description: ID do membro associado ao administrador
 *                   example: 1
 *       responses:
 *         201:
 *           description: Administrador criado com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Admin'
 *               example:
 *                 id: 1
 *                 apelido: admin123
 *                 email: admin@example.com
 *                 membro:
 *                   id: 1
 *                   nome: João Silva
 *                 createdAt: '2023-10-21T12:34:56Z'
 *                 updatedAt: '2023-10-21T12:34:56Z'
 *         500:
 *           description: Erro ao criar administrador
 *           content:
 *             application/json:
 *               example:
 *                 message: Erro ao criar administrador
 */

/**
 * @swagger
 *   /admin/{id}:
 *     get:
 *       summary: Busca um administrador pelo ID
 *       tags: [Administradores]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *           description: O ID do administrador
 *           example: 1
 *       responses:
 *         200:
 *           description: Administrador encontrado
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Admin'
 *               example:
 *                 id: 1
 *                 apelido: admin123
 *                 email: admin@example.com
 *                 membro:
 *                   id: 1
 *                   nome: João Silva
 *                 createdAt: '2023-10-21T12:34:56Z'
 *                 updatedAt: '2023-10-22T15:45:30Z'
 *         404:
 *           description: Administrador não encontrado
 *           content:
 *             application/json:
 *               example:
 *                 message: Administrador não encontrado
 *         401:
 *           description: Token de autenticação não fornecido ou inválido
 *           content:
 *             application/json:
 *               example:
 *                 message: Token de autenticação não fornecido ou inválido
 *         403:
 *           description: Acesso negado (não autorizado)
 *           content:
 *             application/json:
 *               example:
 *                 message: Acesso negado
 *
 *     put:
 *       summary: Atualiza um administrador pelo ID
 *       tags: [Administradores]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *           description: O ID do administrador
 *           example: 1
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - apelido
 *                 - email
 *                 - senha
 *                 - membroId
 *               properties:
 *                 apelido:
 *                   type: string
 *                   description: Apelido do administrador
 *                   example: admin123
 *                 email:
 *                   type: string
 *                   description: Email do administrador
 *                   example: admin@example.com
 *                 senha:
 *                   type: string
 *                   description: Senha do administrador (opcional)
 *                   example: Ab12345*
 *                 membroId:
 *                   type: integer
 *                   description: ID do membro associado ao administrador
 *                   example: 1
 *       responses:
 *         200:
 *           description: Administrador atualizado com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Admin'
 *               example:
 *                 id: 1
 *                 apelido: admin123
 *                 email: admin@example.com
 *                 membro:
 *                   id: 1
 *                   nome: João Silva
 *                 createdAt: '2023-10-21T12:34:56Z'
 *                 updatedAt: '2023-10-22T15:45:30Z'
 *         404:
 *           description: Administrador não encontrado
 *           content:
 *             application/json:
 *               example:
 *                 message: Administrador não encontrado
 *         500:
 *           description: Erro ao atualizar administrador
 *           content:
 *             application/json:
 *               example:
 *                 message: Erro ao atualizar administrador
 *
 *     delete:
 *       summary: Deleta um administrador pelo ID
 *       tags: [Administradores]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *           description: O ID do administrador
 *           example: 1
 *       responses:
 *         204:
 *           description: Administrador deletado com sucesso
 *         404:
 *           description: Administrador não encontrado
 *           content:
 *             application/json:
 *               example:
 *                 message: Administrador não encontrado
 *         500:
 *           description: Erro ao deletar administrador
 *           content:
 *             application/json:
 *               example:
 *                 message: Erro ao deletar administrador
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

import { Router } from 'express';
import { AdminController } from '../controller/adminController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';

const adminRouter = Router();
const adminController = new AdminController();

/**
 * Rota para autenticar um administrador e obter um token JWT.
 * Acesso público (não requer autenticação).
 */
adminRouter.post('/login', (req, res) => adminController.login(req, res));

/**
 * Rota para listar todos os administradores.
 * Requer autenticação e verificação de privilégios de administrador.
 */
adminRouter.get('/', authenticateJWT, isAdmin, (req, res) =>
  adminController.listarAdmins(req, res)
);

/**
 * Rota para buscar um administrador específico por ID.
 * Requer autenticação e verificação de privilégios de administrador.
 */
adminRouter.get('/:id', authenticateJWT, isAdmin, (req, res) =>
  adminController.buscarAdminPorId(req, res)
);

/**
 * Rota para criar um novo administrador.
 * Requer autenticação e verificação de privilégios de administrador.
 */
adminRouter.post('/', authenticateJWT, isAdmin, (req, res) =>
  adminController.criarAdmin(req, res)
);

/**
 * Rota para atualizar um administrador existente.
 * Requer autenticação e verificação de privilégios de administrador.
 */
adminRouter.put('/:id', authenticateJWT, isAdmin, (req, res) =>
  adminController.atualizarAdmin(req, res)
);

/**
 * Rota para deletar um administrador específico por ID.
 * Requer autenticação e verificação de privilégios de administrador.
 */
adminRouter.delete('/:id', authenticateJWT, isAdmin, (req, res) =>
  adminController.deletarAdmin(req, res)
);

export default adminRouter;
