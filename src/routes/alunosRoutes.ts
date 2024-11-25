import { AlunosController } from '../controller/alunosController';
// import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';
import { Router } from 'express';

const alunoRouter = Router();
const alunosController = new AlunosController();

alunoRouter.post(
  '/',
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunosController.criarAluno(req, res)
);

alunoRouter.get(
  '/',
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunosController.listarAlunos(req, res)
);

alunoRouter.get(
  '/:id',
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunosController.buscarAlunosPorId(req, res)
);

alunoRouter.put(
  '/:id',
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunosController.editarAluno(req, res)
);

alunoRouter.delete(
  '/:id',
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunosController.deletarAluno(req, res)
);

export default alunoRouter;
