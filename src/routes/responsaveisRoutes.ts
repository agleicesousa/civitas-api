/**
 * @swagger
 * tags:
 *   - name: Responsaveis
 *     description: Gerenciamento de responsáveis
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Responsavel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID do responsável
 *         membroId:
 *           type: integer
 *           description: ID do membro associado ao responsável
 *         adminId:
 *           type: integer
 *           description: ID do administrador responsável
 *         alunos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do aluno
 *               nome:
 *                 type: string
 *                 description: Nome do aluno
 *           description: Lista de alunos sob responsabilidade desse responsável
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do responsável
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: Data de última atualização do responsável
 *       example:
 *         id: 1
 *         membroId: 3
 *         adminId: 1
 *         alunos:
 *           - id: 10
 *             nome: "Maria Silva"
 *           - id: 11
 *             nome: "João Souza"
 *         dataCriacao: "2023-01-01T12:00:00Z"
 *         dataAtualizacao: "2023-01-10T12:00:00Z"
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Acesso negado. Token não fornecido.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Acesso negado. Token não fornecido."
 *
 *     ForbiddenError:
 *       description: Acesso negado. Permissão insuficiente.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Acesso negado. Permissão insuficiente."
 *
 *     ValidationError:
 *       description: Erro de validação dos dados de entrada.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: "O campo email deve ser válido."
 *                     param:
 *                       type: string
 *                       example: "email"
 *                     location:
 *                       type: string
 *                       example: "body"
 *
 *     InternalServerError:
 *       description: Erro interno no servidor.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Algo deu errado!"
 *               error:
 *                 type: string
 *                 example: "Descrição detalhada do erro."
 */

/**
 * @swagger
 * /responsaveis:
 *   get:
 *     summary: Lista todos os responsáveis
 *     tags: [Responsaveis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de responsáveis retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Responsavel'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /responsaveis/{id}:
 *   get:
 *     summary: Busca um responsável pelo ID
 *     tags: [Responsaveis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do responsável a ser buscado
 *     responses:
 *       200:
 *         description: Responsável encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Responsavel'
 *       404:
 *         description: Responsável não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "Responsável não encontrado."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /responsaveis:
 *   post:
 *     summary: Cria um novo responsável
 *     tags: [Responsaveis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Responsavel'
 *     responses:
 *       201:
 *         description: Responsável criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Responsavel'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: CPF já cadastrado para outro responsável
 *         content:
 *           application/json:
 *             example:
 *               error: "CPF já cadastrado"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /responsaveis/{id}:
 *   put:
 *     summary: Atualiza um responsável existente
 *     tags: [Responsaveis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do responsável a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Responsavel'
 *     responses:
 *       200:
 *         description: Responsável atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Responsavel'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: Responsável não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "Responsável não encontrado."
 *       409:
 *         description: CPF já cadastrado para outro responsável
 *         content:
 *           application/json:
 *             example:
 *               error: "CPF já cadastrado"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /responsaveis/{id}:
 *   delete:
 *     summary: Deleta um responsável pelo ID
 *     tags: [Responsaveis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do responsável a ser deletado
 *     responses:
 *       204:
 *         description: Responsável deletado com sucesso.
 *       404:
 *         description: Responsável não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "Responsável não encontrado."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

import { Router } from 'express';
import { ResponsaveisController } from '../controller/responsaveisController';
import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';

const responsaveisRouter = Router();
const responsaveisController = new ResponsaveisController();

/**
 * Retorna uma lista de objetos que representam os responsáveis, incluindo o membro associado a cada um.
 * Requer autenticação e permissão de visualização de responsáveis.
 */
responsaveisRouter.get(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => responsaveisController.listarResponsaveis(req, res)
);

/**
 * Retorna um objeto que representa o responsável com o ID especificado.
 * Requer autenticação e permissão de visualização de responsáveis.
 */
responsaveisRouter.get(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => responsaveisController.buscarResponsavelPorId(req, res)
);

/**
 * Retorna um objeto que representa o responsável com o CPF especificado.
 * Requer autenticação e permissão de visualização de responsáveis.
 */
responsaveisRouter.get(
  '/cpf/:cpf',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => responsaveisController.buscarResponsavelPorCpf(req, res)
);

/**
 * Cria um novo responsável.
 * Requer autenticação e permissão de gerenciamento de responsáveis.
 */
responsaveisRouter.post(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => responsaveisController.criarResponsavel(req, res)
);

/**
 * Atualiza um responsável existente.
 * Requer autenticação e permissão de gerenciamento de responsáveis.
 */
responsaveisRouter.put(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => responsaveisController.atualizarResponsavel(req, res)
);

/**
 * Deleta um responsável.
 * Requer autenticação e permissão de gerenciamento de responsáveis.
 */
responsaveisRouter.delete(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => responsaveisController.deletarResponsavel(req, res)
);

export default responsaveisRouter;
