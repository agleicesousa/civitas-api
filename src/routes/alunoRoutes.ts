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
  (req, res, next) => alunoController.criarAluno(req, res, next)
);

export default alunoRouter;
