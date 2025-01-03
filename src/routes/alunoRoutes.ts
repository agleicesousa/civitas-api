import { Router } from 'express';
import { AlunoController } from '../controller/alunoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';

const alunoRouter = Router();
const alunoController = new AlunoController();

alunoRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => alunoController.criarAluno(req, res)
);

alunoRouter.get(
  '/paginado',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => alunoController.listarAlunos(req, res)
);

alunoRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => alunoController.listarAlunosCompleto(req, res)
);

alunoRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => alunoController.buscarAlunoPorId(req, res)
);

alunoRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => alunoController.atualizarAluno(req, res)
);

alunoRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res) => alunoController.excluirAluno(req, res)
);

export default alunoRouter;

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cadastra um novo aluno.
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "aluno@email.com"
 *             nomeCompleto: "Aluno Teste"
 *             numeroMatricula: "123456"
 *             turma: 1
 *             cpf: "123.456.789-00"
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos ou turma não encontrada.
 *       401:
 *         description: Admin não autenticado.
 */

/**
 * @swagger
 * /alunos/paginado:
 *   get:
 *     summary: Lista alunos com paginação e busca por termo.
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página.
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Quantidade de alunos por página.
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Termo de busca pelo nome.
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso.
 *       401:
 *         description: Admin não autenticado.
 */

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Lista todos os alunos vinculados ao administrador logado.
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de alunos.
 *       401:
 *         description: Admin não autenticado.
 */

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Busca detalhes de um aluno específico pelo ID.
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno.
 *     responses:
 *       200:
 *         description: Dados do aluno encontrados.
 *       404:
 *         description: Aluno não encontrado.
 */

/**
 * @swagger
 * /alunos/{id}:
 *   put:
 *     summary: Atualiza os dados de um aluno específico.
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "novoemail@email.com"
 *             nomeCompleto: "Nome Atualizado"
 *             senha: "novasenha"
 *             turma: 2
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso.
 *       404:
 *         description: Aluno ou turma não encontrado.
 */

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: Exclui um aluno do sistema.
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno.
 *     responses:
 *       200:
 *         description: Aluno excluído com sucesso.
 *       404:
 *         description: Aluno não encontrado.
 */
