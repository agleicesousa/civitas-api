import { Router } from 'express';
import { ProfessorController } from '../controller/professorController';
import { validarEmail } from '../utils/validarEmailUtils';
// import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';

const professorController = new ProfessorController();
const professorRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: Gerenciamento de professores
 */

/**
 * @swagger
 * /professores:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Professores]
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
 *                 description: Nome do professor
 *                 example: Pedro Almeida
 *               email:
 *                 type: string
 *                 description: Email do professor
 *                 example: pedro.almeida@example.com
 *               senha:
 *                 type: string
 *                 description: Senha do professor
 *                 example: "senha123"
 *     responses:
 *       201:
 *         description: Professor criado com sucesso.
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
 *                   example: Pedro Almeida
 *                 email:
 *                   type: string
 *                   example: pedro.almeida@example.com
 *       400:
 *         description: Erro na validação dos dados.
 *       401:
 *         description: Não autorizado.
 */
professorRouter.post(
  '/',
  validarEmail,
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res, next) => professorController.criarProfessor(req, res, next)
);

/**
 * @swagger
 * /professores:
 *   get:
 *     summary: Lista todos os professores
 *     tags: [Professores]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de professores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do professor
 *                   nome:
 *                     type: string
 *                     description: Nome do professor
 *                   email:
 *                     type: string
 *                     description: Email do professor
 *       401:
 *         description: Não autorizado.
 */
professorRouter.get(
  '/',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res, next) => professorController.listarProfessores(req, res, next)
);

/**
 * @swagger
 * /professores/{id}:
 *   get:
 *     summary: Busca um professor pelo ID
 *     tags: [Professores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID do professor
 *           example: 1
 *     responses:
 *       200:
 *         description: Dados do professor.
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
 *                   example: Pedro Almeida
 *                 email:
 *                   type: string
 *                   example: pedro.almeida@example.com
 *       404:
 *         description: Professor não encontrado.
 *       401:
 *         description: Não autorizado.
 */
professorRouter.get(
  '/:id',
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res, next) => professorController.buscarProfessorPorId(req, res, next)
);

/**
 * @swagger
 * /professores/{id}:
 *   put:
 *     summary: Atualiza os dados de um professor
 *     tags: [Professores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID do professor
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do professor
 *                 example: Pedro Almeida Atualizado
 *               email:
 *                 type: string
 *                 description: Email do professor
 *                 example: pedro.almeida.updated@example.com
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso.
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
 *                   example: Pedro Almeida Atualizado
 *                 email:
 *                   type: string
 *                   example: pedro.almeida.updated@example.com
 *       404:
 *         description: Professor não encontrado.
 *       400:
 *         description: Erro na validação dos dados.
 *       401:
 *         description: Não autorizado.
 */
professorRouter.put(
  '/:id',
  validarEmail,
  //  authenticateJWT,
  //  hasPermission('MANAGE_USERS'),
  (req, res, next) => professorController.atualizarProfessor(req, res, next)
);

/**
 * @swagger
 * /professores/{id}:
 *   delete:
 *     summary: Exclui um professor pelo ID
 *     tags: [Professores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID do professor
 *           example: 1
 *     responses:
 *       200:
 *         description: Professor excluído com sucesso.
 *       404:
 *         description: Professor não encontrado.
 *       401:
 *         description: Não autorizado.
 */
professorRouter.delete(
  '/:id',
  //  authenticateJWT,
  //  hasPermission('MANAGER_USERS'),
  (req, res, next) => professorController.deletarProfessor(req, res, next)
);

export default professorRouter;
