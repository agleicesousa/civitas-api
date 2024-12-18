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
