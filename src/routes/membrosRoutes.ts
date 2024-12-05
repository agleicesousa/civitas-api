import { Router } from 'express';
import { MembrosController } from '../controller/membrosController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';

const membrosRouter = Router();
const membrosController = new MembrosController();

/**
 * @swagger
 * tags:
 *   name: Membros
 *   description: Gerenciamento de membros
 */

/**
 * @swagger
 * /membros:
 *   post:
 *     summary: Cria um novo membro
 *     tags: [Membros]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do membro
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 description: Email do membro
 *                 example: joao.silva@example.com
 *               senha:
 *                 type: string
 *                 description: Senha do membro
 *                 example: "senha123"
 *     responses:
 *       201:
 *         description: Membro criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: João Silva
 *                 email:
 *                   type: string
 *                   example: joao.silva@example.com
 *       400:
 *         description: Erro na validação dos dados.
 *       401:
 *         description: Não autorizado.
 */
membrosRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.criarMembro(req, res)
);

/**
 * @swagger
 * /membros:
 *   get:
 *     summary: Lista todos os membros
 *     tags: [Membros]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de membros.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do membro
 *                   nome:
 *                     type: string
 *                     description: Nome do membro
 *                   email:
 *                     type: string
 *                     description: Email do membro
 *       401:
 *         description: Não autorizado.
 */
membrosRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.listarMembros(req, res)
);

/**
 * @swagger
 * /membros/{id}:
 *   get:
 *     summary: Busca um membro pelo ID
 *     tags: [Membros]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do membro
 *         example: 1
 *     responses:
 *       200:
 *         description: Dados do membro.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: João Silva
 *                 email:
 *                   type: string
 *                   example: joao.silva@example.com
 *       404:
 *         description: Membro não encontrado.
 *       401:
 *         description: Não autorizado.
 */
membrosRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.buscarMembroPorId(req, res)
);

/**
 * @swagger
 * /membros/{id}:
 *   put:
 *     summary: Atualiza os dados de um membro
 *     tags: [Membros]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do membro
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do membro
 *                 example: João Silva Atualizado
 *               email:
 *                 type: string
 *                 description: Email do membro
 *                 example: joao.silva.updated@example.com
 *     responses:
 *       200:
 *         description: Membro atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: João Silva Atualizado
 *                 email:
 *                   type: string
 *                   example: joao.silva.updated@example.com
 *       404:
 *         description: Membro não encontrado.
 *       401:
 *         description: Não autorizado.
 */
membrosRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.atualizarMembro(req, res)
);

/**
 * @swagger
 * /membros/{id}:
 *   delete:
 *     summary: Exclui um membro pelo ID
 *     tags: [Membros]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do membro
 *         example: 1
 *     responses:
 *       200:
 *         description: Membro excluído com sucesso.
 *       404:
 *         description: Membro não encontrado.
 *       401:
 *         description: Não autorizado.
 */
membrosRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.deletarMembro(req, res)
);

export default membrosRouter;
