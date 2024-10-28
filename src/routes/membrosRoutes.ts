/**
 * @swagger
 * components:
 *   schemas:
 *     Membro:
 *       type: object
 *       required:
 *         - numeroMatricula
 *         - nomeCompleto
 *         - dataNascimento
 *         - rg
 *         - cpf
 *         - tipoConta
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID do membro gerado automaticamente.
 *         numeroMatricula:
 *           type: string
 *           description: Número de matrícula único do membro.
 *         nomeCompleto:
 *           type: string
 *           description: Nome completo do membro.
 *         dataNascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento do membro.
 *         rg:
 *           type: string
 *           description: Número do RG único do membro.
 *         cpf:
 *           type: string
 *           description: Número do CPF único do membro.
 *         tipoConta:
 *           type: string
 *           enum: [admin, professor, aluno, responsavel]
 *           description: Tipo de conta do membro (admin, professor, aluno ou responsavel).
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro.
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: Data de última atualização do registro.
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
 * tags:
 *   name: Membros
 *   description: Operações relacionadas aos membros
 *
 * /membros:
 *   get:
 *     summary: Retorna a lista de todos os membros
 *     tags: [Membros]
 *     responses:
 *       200:
 *         description: A lista de membros.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membro'
 *       500:
 *         description: Erro ao buscar membros.
 *
 *   post:
 *     summary: Cria um novo membro
 *     tags: [Membros]
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
 *       500:
 *         description: Erro ao criar membro.
 *
 * /membros/{id}:
 *   get:
 *     summary: Retorna um membro pelo ID
 *     tags: [Membros]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do membro
 *     responses:
 *       200:
 *         description: O membro correspondente ao ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membro'
 *       404:
 *         description: Membro não encontrado.
 *       500:
 *         description: Erro ao buscar membro.
 *
 *   put:
 *     summary: Atualiza um membro pelo ID
 *     tags: [Membros]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do membro
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
 *       500:
 *         description: Erro ao atualizar membro.
 *
 *   delete:
 *     summary: Deleta um membro pelo ID
 *     tags: [Membros]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do membro
 *     responses:
 *       204:
 *         description: Membro deletado com sucesso.
 *       500:
 *         description: Erro ao deletar membro.
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
  hasPermission('VIEW_MEMBERS'),
  (req, res) => membrosController.listarMembros(req, res)
);

/**
 * Rota para buscar um membro específico por ID
 * Requer autenticação e permissão de visualização de membros.
 */
membrosRouter.get(
  '/:id',
  authenticateJWT,
  hasPermission('VIEW_MEMBERS'),
  (req, res) => membrosController.buscarMembroPorId(req, res)
);

/**
 * Rota para criar um novo membro
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
membrosRouter.post(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => membrosController.criarMembro(req, res)
);

/**
 * Rota para atualizar um membro existente
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
membrosRouter.put(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => membrosController.atualizarMembro(req, res)
);

/**
 * Rota para deletar um membro existente
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
membrosRouter.delete(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => membrosController.deletarMembro(req, res)
);

export default membrosRouter;
