import express from 'express';
import { PdiController } from '../controller/pdiController';
import { ProfessorController } from '../controller/professorController';
import { TurmasController } from '../controller/turmasController';
import { authMiddleware } from '../middlewares/authMiddleware';
const pdiController = new PdiController();
const professorController = new ProfessorController();
const turmasController = new TurmasController();
const pdiRouter = express.Router();

pdiRouter.post('/alunos/:id', authMiddleware, (req, res) =>
  pdiController.criarPdi(req, res)
);

pdiRouter.get('/:id/detalhes', authMiddleware, (req, res) =>
  pdiController.obterDetalhesPDI(req, res)
);

pdiRouter.get('/alunos/:id/dados', authMiddleware, (req, res) =>
  pdiController.obterResumoProfessorAluno(req, res)
);

pdiRouter.get('/alunos/:id/registros', authMiddleware, (req, res) =>
  pdiController.listarPDIsDoAluno(req, res)
);

pdiRouter.get('/professor/turmas', authMiddleware, (req, res) =>
  professorController.professorTurmas(req, res)
);

pdiRouter.get('/professor/turmas/:id/alunos', (req, res) =>
  turmasController.buscarAlunosTurma(req, res)
);

pdiRouter.delete('/:id', (req, res) => pdiController.deletarPDI(req, res));

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
 *         description: ID do aluno
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 * /pdi/{id}/detalhes:
 *   get:
 *     summary: Obtém os detalhes de um PDI específico.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do PDI
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
 * /pdi/alunos/{id}/dados:
 *   get:
 *     summary: Obtém o resumo da relação entre professor e aluno.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do aluno
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso.
 *       404:
 *         description: Aluno ou professor não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

/**
 * @swagger
 * /pdi/alunos/{id}/registros:
 *   get:
 *     summary: Lista todos os PDIs de um aluno.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do aluno
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
 *   delete:
 *     summary: Deleta um PDI específico.
 *     tags: [PDI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do PDI
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
 *         description: ID do aluno
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 * /pdi/{id}/detalhes:
 *   get:
 *     summary: Obtém os detalhes de um PDI específico.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do PDI
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
 * /pdi/alunos/{id}/dados:
 *   get:
 *     summary: Obtém o resumo da relação entre professor e aluno.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do aluno
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso.
 *       404:
 *         description: Aluno ou professor não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

/**
 * @swagger
 * /pdi/alunos/{id}/registros:
 *   get:
 *     summary: Lista todos os PDIs de um aluno.
 *     tags: [PDI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do aluno
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
 *   delete:
 *     summary: Deleta um PDI específico.
 *     tags: [PDI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do PDI
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
