import { ProfessorController } from '../controller/professorController';
import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { Router } from 'express';
import { checkAdminPermission } from '../middlewares/adminPermissionMiddleware';
import { Professor } from '../entities/professorEntities';

const professorController = new ProfessorController();
const professorRouter = Router();

/**
 * Cria um novo professor.
 */
professorRouter.post(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => professorController.criarProfessor(req, res)
);

/**
 * Lista todos os professores do admin autenticado.
 */
professorRouter.get(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => professorController.listarProfessores(req, res)
);

/**
 * Busca um professor por ID.
 * Somente o admin que criou o professor pode acessá-lo.
 */
professorRouter.get(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  checkAdminPermission(Professor, 'professor'),
  (req, res) => professorController.buscarProfessorPorId(req, res)
);

/**
 * Edita os dados de um professor.
 * Somente o admin que criou o professor pode editá-lo.
 */
professorRouter.put(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  checkAdminPermission(Professor, 'professor'),
  (req, res) => professorController.editarProfessor(req, res)
);

/**
 * Deleta um professor.
 * Somente o admin que criou o professor pode deletá-lo.
 */
professorRouter.delete(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  checkAdminPermission(Professor, 'professor'),
  (req, res) => professorController.deletarProfessor(req, res)
);

export default professorRouter;
