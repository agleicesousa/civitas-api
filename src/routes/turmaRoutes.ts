import { TurmasController } from '../controller/turmasController';
import { Router } from 'express';
const turmaController = new TurmasController();
const turmasRouter = Router();

turmasRouter.post('/', (req, res) => turmaController.criarTurma(req, res));
turmasRouter.get('/', (req, res) => turmaController.listarTurmas(req, res));
turmasRouter.get('/:id', (req, res) => turmaController.buscarTurma(req, res));
turmasRouter.put('/:id', (req, res) => turmaController.editarTurma(req, res));
turmasRouter.delete('/:id', (req, res) =>
  turmaController.deletarTurma(req, res)
);

export default turmasRouter;
