/**
 * @swagger
 * tags:
 *   - name: Membros
 *     description: Gerenciamento de membros
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
 *     Membro:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID do membro
 *         numeroMatricula:
 *           type: string
 *           description: Número de matrícula único do membro
 *         nomeCompleto:
 *           type: string
 *           description: Nome completo do membro
 *         dataNascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento do membro
 *         rg:
 *           type: string
 *           description: Número do RG único do membro
 *         cpf:
 *           type: string
 *           description: Número do CPF único do membro
 *         tipoConta:
 *           type: string
 *           enum: [admin, professor, aluno, responsavel]
 *           description: Tipo de conta do membro
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: Data de última atualização do registro
 *       required:
 *         - numeroMatricula
 *         - nomeCompleto
 *         - tipoConta
 *       example:
 *         id: 1
 *         numeroMatricula: "20221001"
 *         nomeCompleto: "João Silva"
 *         dataNascimento: "1990-05-15"
 *         rg: "123456789"
 *         cpf: "123.456.789-00"
 *         tipoConta: "aluno"
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
 * /membros:
 *   get:
 *     summary: Lista todos os membros
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de membros.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membro'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /membros/{id}:
 *   get:
 *     summary: Busca um membro pelo ID
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do membro a ser buscado
 *     responses:
 *       200:
 *         description: Membro encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membro'
 *       404:
 *         description: Membro não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "Membro não encontrado."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /membros:
 *   post:
 *     summary: Cria um novo membro
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membro'
 *     responses:
 *       201:
 *         description: Membro criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membro'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /membros/{id}:
 *   put:
 *     summary: Atualiza um membro pelo ID
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do membro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membro'
 *     responses:
 *       200:
 *         description: Membro atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membro'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: Membro não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "Membro não encontrado."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /membros/{id}:
 *   delete:
 *     summary: Deleta um membro pelo ID
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do membro
 *     responses:
 *       204:
 *         description: Membro deletado com sucesso.
 *       404:
 *         description: Membro não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "Membro não encontrado."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

import { Router } from 'express';
import { MembrosController } from '../controller/membrosController';
import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';

const membrosRouter = Router();
const membrosController = new MembrosController();

/**
 * Rota para listar todos os membros
 * Requer autenticação e permissão de visualização de membros.
 */
membrosRouter.get(
  '/',
  authenticateJWT,
  hasPermission('VIEW_MEMBERS', ''),
  (req, res) => membrosController.listarMembros(req, res)
);

/**
 * Rota para buscar um membro específico por ID
 * Requer autenticação e permissão de visualização de membros.
 */
membrosRouter.get(
  '/:id',
  authenticateJWT,
  hasPermission('VIEW_MEMBERS', ''),
  (req, res) => membrosController.buscarMembroPorId(req, res)
);

/**
 * Rota para criar um novo membro
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
membrosRouter.post(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => membrosController.criarMembro(req, res)
);

/**
 * Rota para atualizar um membro existente
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
membrosRouter.put(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => membrosController.atualizarMembro(req, res)
);

/**
 * Rota para deletar um membro existente
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
membrosRouter.delete(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS', ''),
  (req, res) => membrosController.deletarMembro(req, res)
);

export default membrosRouter;
