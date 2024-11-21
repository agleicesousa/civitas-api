import { ProfessorController } from '../controller/professorController';
import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { Router } from 'express';
import { checkAdminPermission } from '../middlewares/adminPermissionMiddleware';
import { Professor } from '../entities/professoresEntities';

const professorController = new ProfessorController();
const professorRouter = Router();

/**
 * Cria um novo professor.
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
professorRouter.post(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  (req, res) => professorController.criarProfessor(req, res)
);

/**
 * Lista todos os professores.
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
professorRouter.get(
  '/',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  checkAdminPermission(Professor, 'professor'),
  (req, res) => professorController.listarProfessores(req, res)
);

/**
 * Busca um professor por ID.
 * Requer autenticação e permissão de gerenciamento de usuários.
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
 * Requer autenticação e permissão de gerenciamento de usuários.
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
 * Requer autenticação e permissão de gerenciamento de usuários.
 */
professorRouter.delete(
  '/:id',
  authenticateJWT,
  hasPermission('MANAGE_USERS'),
  checkAdminPermission(Professor, 'professor'),
  (req, res) => professorController.deletarProfessor(req, res)
);

export default professorRouter;