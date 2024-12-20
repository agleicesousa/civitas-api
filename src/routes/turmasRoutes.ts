import { TurmasController } from '../controller/turmasController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';
import { Router } from 'express';

const turmaController = new TurmasController();
const turmasRouter = Router();

turmasRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => turmaController.criarTurma(req, res)
);

turmasRouter.get('/', authMiddleware, (req, res) =>
  turmaController.listarTurmas(req, res)
);

turmasRouter.get('/:id', authMiddleware, (req, res) =>
  turmaController.buscarTurmaId(req, res)
);

turmasRouter.put('/:id', authMiddleware, (req, res) =>
  turmaController.editarTurma(req, res)
);

turmasRouter.delete('/:id', authMiddleware, (req, res) =>
  turmaController.deletarTurma(req, res)
);

export default turmasRouter;

/**
 * @swagger
 * /turmas:
 *   post:
 *     summary: Cria uma nova turma
 *     tags:
 *       - Turmas
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               turmaApelido:
 *                 type: string
 *                 description: Apelido da turma
 *               periodoLetivo:
 *                 type: string
 *                 description: Período letivo
 *               anoLetivo:
 *                 type: string
 *                 description: Ano letivo
 *               ensino:
 *                 type: string
 *                 description: Tipo de ensino
 *             required:
 *               - turmaApelido
 *               - periodoLetivo
 *               - anoLetivo
 *               - ensino
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Permissão negada
 *       409:
 *         description: Conflito de dados
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /turmas:
 *   get:
 *     summary: Lista todas as turmas com paginação
 *     tags:
 *       - Turmas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Número de itens por página
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Lista de turmas retornada com sucesso
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /turmas/{id}:
 *   get:
 *     summary: Busca uma turma pelo ID
 *     tags:
 *       - Turmas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma encontrada com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /turmas/{id}:
 *   put:
 *     summary: Atualiza os dados de uma turma
 *     tags:
 *       - Turmas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               turmaApelido:
 *                 type: string
 *                 description: Novo apelido da turma
 *               periodoLetivo:
 *                 type: string
 *                 description: Novo período letivo
 *               anoLetivo:
 *                 type: string
 *                 description: Novo ano letivo
 *               ensino:
 *                 type: string
 *                 description: Novo tipo de ensino
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Turma não encontrada
 *       409:
 *         description: Conflito de dados
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /turmas/{id}:
 *   delete:
 *     summary: Exclui uma turma pelo ID
 *     tags:
 *       - Turmas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma excluída com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /turmas/{id}/alunos:
 *   get:
 *     summary: Busca todos os alunos de uma turma
 *     tags:
 *       - Turmas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
