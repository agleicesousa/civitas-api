import { Router } from 'express';
import { AlunoController } from '../controller/alunoController';
import { validarEmail } from '../middlewares/validarEmail';
//  import { authenticateJWT, hasPermission } from '../middlewares/authMiddleware';

// TODO: as linhas comentadas ainda serão utilizadas.

const alunoRouter = Router();
const alunoController = new AlunoController();

alunoRouter.post(
  '/',
  validarEmail,
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunoController.criarAluno(req, res)
);

alunoRouter.get(
  '/',
  validarEmail,
  //  authenticateJWT,
  //  hasPermission('VIEW_MEMBERS'),
  (req, res) => alunoController.listarAlunos(req, res)
);

export default alunoRouter;
