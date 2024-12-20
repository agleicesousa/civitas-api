import { Router } from 'express';
import { MembrosController } from '../controller/membrosController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';

const membrosRouter = Router();
const membrosController = new MembrosController();

membrosRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.criarMembro(req, res)
);

membrosRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.listarMembros(req, res)
);

membrosRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.buscarMembroPorId(req, res)
);

membrosRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.atualizarMembro(req, res)
);

membrosRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => membrosController.deletarMembro(req, res)
);

export default membrosRouter;

/**
 * @swagger
 * /membros:
 *   post:
 *     summary: Cria um novo membro.
 *     description: Cria um novo membro no sistema, associando-o ao administrador logado.
 *     tags:
 *       - Membros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 example: "joao.silva@example.com"
 *               adminCriadorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Membro criado com sucesso.
 *       400:
 *         description: Admin não autenticado ou dados inválidos.
 *       500:
 *         description: Erro ao criar membro.
 */

/**
 * @swagger
 * /membros:
 *   get:
 *     summary: Lista todos os membros.
 *     description: Lista todos os membros criados por um administrador autenticado.
 *     tags:
 *       - Membros
 *     responses:
 *       200:
 *         description: Lista de membros com sucesso.
 *       401:
 *         description: Admin não autenticado.
 *       500:
 *         description: Erro ao listar membros.
 */

/**
 * @swagger
 * /membros/{id}:
 *   get:
 *     summary: Busca um membro pelo ID.
 *     description: Busca os detalhes de um membro específico pelo ID, desde que o administrador tenha permissão.
 *     tags:
 *       - Membros
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do membro a ser buscado.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Membro encontrado com sucesso.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Membro não encontrado.
 *       500:
 *         description: Erro ao buscar membro.
 */

/**
 * @swagger
 * /membros/{id}:
 *   put:
 *     summary: Atualiza os dados de um membro.
 *     description: Atualiza os dados de um membro específico. O administrador deve ter permissão para realizar essa operação.
 *     tags:
 *       - Membros
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do membro a ser atualizado.
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva Atualizado"
 *               email:
 *                 type: string
 *                 example: "joao.silva.updated@example.com"
 *     responses:
 *       200:
 *         description: Membro atualizado com sucesso.
 *       400:
 *         description: ID inválido ou dados inválidos.
 *       404:
 *         description: Membro não encontrado ou você não tem permissão para atualizá-lo.
 *       500:
 *         description: Erro ao atualizar membro.
 */

/**
 * @swagger
 * /membros/{id}:
 *   delete:
 *     summary: Deleta um membro.
 *     description: Deleta um membro específico. O administrador precisa ter permissão para realizar essa operação.
 *     tags:
 *       - Membros
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do membro a ser deletado.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       204:
 *         description: Membro deletado com sucesso.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Membro não encontrado ou você não tem permissão para deletá-lo.
 *       500:
 *         description: Erro ao deletar membro.
 */
