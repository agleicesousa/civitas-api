/**
 * @swagger
 * tags:
 *   name: Responsaveis
 *   description: Gerenciamento de responsáveis
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Responsavel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID do responsável
 *         membroId:
 *           type: integer
 *           description: O ID do membro associado
 *         adminId:
 *           type: integer
 *           description: O ID do administrador associado
 *         alunos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Aluno'
 *           description: Lista de alunos sob responsabilidade desse responsável
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: A data de criação do responsável
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: A data de atualização do responsável
 *       required:
 *         - membroId
 *         - adminId
 *
 *     Membro:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID do membro
 *         nome:
 *           type: string
 *           description: O nome do membro
 *         email:
 *           type: string
 *           description: O email do membro
 *         tipoConta:
 *           type: string
 *           enum: ['admin', 'professor', 'aluno', 'responsavel']
 *           description: O tipo de conta do membro
 *       required:
 *         - nome
 *         - email
 *         - tipoConta
 *
 *     Aluno:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID do aluno
 *         membroId:
 *           type: integer
 *           description: O ID do membro associado ao aluno
 *         adminId:
 *           type: integer
 *           description: O ID do administrador responsável
 *         responsavelId:
 *           type: integer
 *           description: O ID do responsável pelo aluno
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: A data de criação do aluno
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: A data de atualização do aluno
 *       required:
 *         - membroId
 *         - adminId
 *         - responsavelId
 */

/**
 * @swagger
 * /responsaveis:
 *   get:
 *     summary: Lista todos os responsáveis
 *     tags: [Responsaveis]
 *     responses:
 *       200:
 *         description: Lista de responsáveis retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Responsavel'
 *       500:
 *         description: Erro ao listar responsáveis
 */

/**
 * @swagger
 * /responsaveis/{id}:
 *   get:
 *     summary: Busca um responsável pelo ID
 *     tags: [Responsaveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
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
 *         description: Responsável não encontrado
 *       500:
 *         description: Erro ao buscar responsável
 */

/**
 * @swagger
 * /responsaveis:
 *   post:
 *     summary: Cria um novo responsável
 *     tags: [Responsaveis]
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
 *       500:
 *         description: Erro ao criar responsável
 */

/**
 * @swagger
 * /responsaveis/{id}:
 *   put:
 *     summary: Atualiza um responsável existente
 *     tags: [Responsaveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
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
 *       404:
 *         description: Responsável não encontrado
 *       500:
 *         description: Erro ao atualizar responsável
 */

/**
 * @swagger
 * /responsaveis/{id}:
 *   delete:
 *     summary: Deleta um responsável
 *     tags: [Responsaveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do responsável a ser deletado
 *     responses:
 *       200:
 *         description: Responsável deletado com sucesso
 *       404:
 *         description: Responsável não encontrado
 *       500:
 *         description: Erro ao deletar responsável
 */

import { Router } from 'express';
import { ResponsaveisController } from '../controller/responsaveisController';

const responsaveisRouter = Router();
const responsaveisController = new ResponsaveisController();

/**
 * Retorna uma lista de objetos que representam os responsáveis, incluindo o membro associado a cada um.
 */
responsaveisRouter.get('/', responsaveisController.listarResponsaveis);

/**
 * Retorna um objeto que representa o responsável com o ID especificado.
 */
responsaveisRouter.get('/:id', responsaveisController.buscarResponsavelPorId);

/**
 * Cria um novo responsável.
 */
responsaveisRouter.post('/', responsaveisController.criarResponsavel);

/**
 * Atualiza um responsável existente.
 */
responsaveisRouter.put('/:id', responsaveisController.atualizarResponsavel);

/**
 * Deleta um responsável.
 */
responsaveisRouter.delete('/:id', responsaveisController.deletarResponsavel);

export default responsaveisRouter;
