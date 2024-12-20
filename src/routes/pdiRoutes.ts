import express from 'express';
import { PdiController } from '../controller/pdiController';
import { authMiddleware } from '../middlewares/authMiddleware';

const pdiController = new PdiController();
const pdiRouter = express.Router();

pdiRouter.post('/alunos/:id', authMiddleware, (req, res) =>
  pdiController.criarPDI(req, res)
);

pdiRouter.get('/:id', authMiddleware, (req, res) =>
  pdiController.obterDetalhesPDI(req, res)
);

pdiRouter.get('/alunos/:id/resumo', authMiddleware, (req, res) =>
  pdiController.obterResumoProfessorAluno(req, res)
);

pdiRouter.get('/alunos/:id', authMiddleware, (req, res) =>
  pdiController.listarPDIsDoAluno(req, res)
);

pdiRouter.put('/:id', authMiddleware, (req, res) =>
  pdiController.atualizarPDI(req, res)
);

pdiRouter.delete('/:id', authMiddleware, (req, res) =>
  pdiController.deletarPDI(req, res)
);

export default pdiRouter;

/**
 * @swagger
 * /pdi/alunos/{id}:
 *   post:
 *     summary: Cria um novo PDI para um aluno.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do aluno.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: PDI criado com sucesso.
 *       404:
 *         description: Aluno ou professor não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

/**
 * @swagger
 * /pdi/{id}:
 *   get:
 *     summary: Obtém os detalhes de um PDI específico.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do PDI.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do PDI retornados com sucesso.
 *       404:
 *         description: PDI não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

/**
 * @swagger
 * /pdi/alunos/{id}/resumo:
 *   get:
 *     summary: Obtém o resumo da relação entre professor e aluno.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do aluno.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resumo retornado com sucesso.
 *       404:
 *         description: Aluno ou professor não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

/**
 * @swagger
 * /pdi/alunos/{id}:
 *   get:
 *     summary: Lista todos os PDIs de um aluno.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do aluno.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de PDIs retornada com sucesso.
 *       404:
 *         description: Nenhum PDI encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

/**
 * @swagger
 * /pdi/{id}:
 *   put:
 *     summary: Atualiza um PDI específico.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do PDI.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: PDI atualizado com sucesso.
 *       404:
 *         description: PDI não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

/**
 * @swagger
 * /pdi/{id}:
 *   delete:
 *     summary: Deleta um PDI específico.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do PDI.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDI removido com sucesso.
 *       404:
 *         description: PDI não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
