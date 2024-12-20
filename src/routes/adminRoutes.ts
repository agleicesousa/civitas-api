import { Router } from 'express';
import { AdminController } from '../controller/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => adminController.criarAdmin(req, res)
);

adminRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => adminController.listarAdmins(req, res)
);

adminRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => adminController.buscarAdminPorId(req, res)
);

adminRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => adminController.atualizarAdmin(req, res)
);

adminRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => adminController.deletarAdmin(req, res)
);

export default adminRouter;

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Cadastrar um novo administrador
 *     description: Cria um novo administrador no sistema, validando e criptografando a senha.
 *     tags:
 *       - Admin
 *     requestBody:
 *       description: Dados do novo administrador
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *               nomeCompleto:
 *                 type: string
 *               tipoConta:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *     responses:
 *       '201':
 *         description: Administrador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 nomeCompleto:
 *                   type: string
 *                 tipoConta:
 *                   type: string
 *       '400':
 *         description: "Erro de validação de dados (ex: senha inválida)"
 *       '401':
 *         description: Admin não autenticado
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Listar administradores
 *     description: Lista todos os administradores criados pelo administrador autenticado.
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: Lista de administradores
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 nomeCompleto:
 *                   type: string
 *                 tipoConta:
 *                   type: string
 *       '401':
 *         description: Admin não autenticado
 */

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Buscar administrador por ID
 *     description: Busca um administrador específico pelo ID fornecido.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do administrador a ser buscado
 *     responses:
 *       '200':
 *         description: Administrador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 nomeCompleto:
 *                   type: string
 *                 tipoConta:
 *                   type: string
 *       '404':
 *         description: Administrador não encontrado
 *       '401':
 *         description: Admin não autenticado
 */

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Atualizar administrador
 *     description: Atualiza as informações de um administrador. Permite modificar dados como email, nome ou senha.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do administrador a ser atualizado
 *     requestBody:
 *       description: Dados do administrador a serem atualizados
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *               nomeCompleto:
 *                 type: string
 *               numeroMatricula:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Administrador atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 nomeCompleto:
 *                   type: string
 *                 tipoConta:
 *                   type: string
 *       '400':
 *         description: Erro de validação de dados
 *       '401':
 *         description: Admin não autenticado
 *       '404':
 *         description: Administrador não encontrado
 */

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Deletar administrador
 *     description: Deleta um administrador do sistema.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do administrador a ser excluído
 *     responses:
 *       '200':
 *         description: Administrador excluído com sucesso
 *       '404':
 *         description: Administrador não encontrado
 *       '401':
 *         description: Admin não autenticado
 */
