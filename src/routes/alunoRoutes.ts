import { Router } from 'express';
import { AlunoController } from '../controller/alunoController';
import { validarEmail } from '../utils/validarEmailUtils';
// import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';

// TODO: as linhas comentadas ainda serão utilizadas.

const alunoRouter = Router();
const alunoController = new AlunoController();

/**
 * @swagger
 * tags:
 *   name: Aluno
 *   description: Gerenciamento de alunos
 */

/**
 * @swagger
 * /aluno:
 *   post:
 *     summary: Cria um novo aluno
 *     tags: [Aluno]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do aluno
 *                 example: Maria Silva
 *               email:
 *                 type: string
 *                 description: Email do aluno
 *                 example: maria.silva@example.com
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso.
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
 *                   example: Maria Silva
 *                 email:
 *                   type: string
 *                   example: maria.silva@example.com
 *       400:
 *         description: Erro na validação dos dados.
 */
alunoRouter.post(
  '/',
  validarEmail,
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunoController.criarAluno(req, res)
);

/**
 * @swagger
 * /aluno:
 *   get:
 *     summary: Lista todos os alunos
 *     tags: [Aluno]
 *     responses:
 *       200:
 *         description: Lista de alunos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do aluno
 *                   nome:
 *                     type: string
 *                     description: Nome do aluno
 *                   email:
 *                     type: string
 *                     description: Email do aluno
 *       401:
 *         description: Não autorizado.
 */
alunoRouter.get(
  '/',
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunoController.listarAlunos(req, res)
);

/**
 * @swagger
 * /aluno:
 *   put:
 *     summary: Atualiza os dados de um aluno
 *     tags: [Aluno]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do aluno
 *                 example: 1
 *               nome:
 *                 type: string
 *                 description: Nome do aluno
 *                 example: Maria Silva Atualizada
 *               email:
 *                 type: string
 *                 description: Email do aluno
 *                 example: maria.atualizada@example.com
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso.
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
 *                   example: Maria Silva Atualizada
 *                 email:
 *                   type: string
 *                   example: maria.atualizada@example.com
 *       400:
 *         description: Erro na validação dos dados.
 *       404:
 *         description: Aluno não encontrado.
 */
alunoRouter.put(
  '/',
  validarEmail,
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunoController.atualizarAluno(req, res)
);

/**
 * @swagger
 * /aluno:
 *   delete:
 *     summary: Exclui um aluno
 *     tags: [Aluno]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do aluno a ser excluído
 *         example: 1
 *     responses:
 *       200:
 *         description: Aluno excluído com sucesso.
 *       404:
 *         description: Aluno não encontrado.
 */
alunoRouter.delete(
  '/',
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunoController.excluirAluno(req, res)
);

export default alunoRouter;
