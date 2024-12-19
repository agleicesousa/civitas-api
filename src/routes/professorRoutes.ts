import { Router } from 'express';
import { ProfessorController } from '../controller/professorController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';

const professorController = new ProfessorController();
const professorRouter = Router();

professorRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.criarProfessor(req, res)
);

professorRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.listarProfessores(req, res)
);

professorRouter.get(
  '/paginado',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.listarProfessoresPagina(req, res)
);

professorRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.buscarProfessorPorId(req, res)
);

professorRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.atualizarProfessor(req, res)
);

professorRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => professorController.deletarProfessor(req, res)
);

export default professorRouter;

/**
 * @swagger
 * /professores:
 *   post:
 *     summary: Cria um novo professor
 *     description: Apenas administradores autenticados podem criar um novo professor no sistema.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados do novo professor a ser criado.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               nomeCompleto:
 *                 type: string
 *               numeroMatricula:
 *                 type: string
 *               cpf:
 *                 type: string
 *               turma:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Professor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 professor:
 *                   $ref: '#/components/schemas/Professor'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /professores:
 *   get:
 *     summary: Lista todos os professores
 *     description: Recupera todos os professores cadastrados para um administrador específico.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professor'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /professores/paginado:
 *   get:
 *     summary: Lista professores com paginação
 *     description: Recupera professores com base na página e tamanho definidos, além de permitir filtragem por nome.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: perPage
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: searchTerm
 *         required: false
 *         schema:
 *           type: string
 *           example: "João"
 *     responses:
 *       200:
 *         description: Lista de professores paginada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 page:
 *                   type: integer
 *                 perPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Professor'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /professores/{id}:
 *   get:
 *     summary: Busca um professor por ID
 *     description: Recupera as informações de um professor específico através do seu ID.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Dados do professor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /professores/{id}:
 *   put:
 *     summary: Atualiza os dados de um professor
 *     description: Atualiza as informações de um professor específico.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: body
 *         name: professor
 *         description: Dados a serem atualizados.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             nomeCompleto:
 *               type: string
 *             numeroMatricula:
 *               type: string
 *             cpf:
 *               type: string
 *             turma:
 *               type: array
 *               items:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 professor:
 *                   $ref: '#/components/schemas/Professor'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /professores/{id}:
 *   delete:
 *     summary: Deleta um professor
 *     description: Deleta um professor do sistema.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Professor excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /professores/turmas:
 *   get:
 *     summary: Recupera as turmas associadas ao professor autenticado
 *     description: Recupera as turmas do professor que está autenticado.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turmas do professor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   turmaApelido:
 *                     type: string
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
