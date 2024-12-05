import { TurmasController } from '../controller/turmasController';
// import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { Router } from 'express';

const turmaController = new TurmasController();
const turmasRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Turmas
 *   description: Gerenciamento de turmas
 */

/**
 * @swagger
 * /turmas:
 *   post:
 *     summary: Cria uma nova turma
 *     tags: [Turmas]
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
 *                 description: Nome da turma
 *                 example: Turma A
 *               descricao:
 *                 type: string
 *                 description: Descrição da turma
 *                 example: Turma para o ensino fundamental
 *     responses:
 *       201:
 *         description: Turma criada com sucesso.
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
 *                   example: Turma A
 *                 descricao:
 *                   type: string
 *                   example: Turma para o ensino fundamental
 *       400:
 *         description: Erro na validação dos dados.
 *       401:
 *         description: Não autorizado.
 */
turmasRouter.post(
  '/',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res) => turmaController.criarTurma(req, res)
);

/**
 * @swagger
 * /turmas:
 *   get:
 *     summary: Lista todas as turmas
 *     tags: [Turmas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turmas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da turma
 *                   nome:
 *                     type: string
 *                     description: Nome da turma
 *                   descricao:
 *                     type: string
 *                     description: Descrição da turma
 *       401:
 *         description: Não autorizado.
 */
turmasRouter.get(
  '/',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res) => turmaController.listarTurmas(req, res)
);

/**
 * @swagger
 * /turmas/{id}:
 *   get:
 *     summary: Busca uma turma pelo ID
 *     tags: [Turmas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da turma
 *         example: 1
 *     responses:
 *       200:
 *         description: Dados da turma.
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
 *                   example: Turma A
 *                 descricao:
 *                   type: string
 *                   example: Turma para o ensino fundamental
 *       404:
 *         description: Turma não encontrada.
 *       401:
 *         description: Não autorizado.
 */
turmasRouter.get(
  '/:id',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res) => turmaController.buscarTurma(req, res)
);

/**
 * @swagger
 * /turmas/{id}:
 *   put:
 *     summary: Atualiza os dados de uma turma
 *     tags: [Turmas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da turma
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
 *                 description: Nome da turma
 *                 example: Turma A Atualizada
 *               descricao:
 *                 type: string
 *                 description: Descrição da turma
 *                 example: Turma atualizada para o ensino médio
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso.
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
 *                   example: Turma A Atualizada
 *                 descricao:
 *                   type: string
 *                   example: Turma atualizada para o ensino médio
 *       400:
 *         description: Erro na validação dos dados.
 *       404:
 *         description: Turma não encontrada.
 *       401:
 *         description: Não autorizado.
 */
turmasRouter.put(
  '/:id',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res) => turmaController.editarTurma(req, res)
);

/**
 * @swagger
 * /turmas/{id}:
 *   delete:
 *     summary: Exclui uma turma pelo ID
 *     tags: [Turmas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da turma
 *         example: 1
 *     responses:
 *       200:
 *         description: Turma excluída com sucesso.
 *       404:
 *         description: Turma não encontrada.
 *       401:
 *         description: Não autorizado.
 */
turmasRouter.delete(
  '/:id',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res) => turmaController.deletarTurma(req, res)
);

export default turmasRouter;
