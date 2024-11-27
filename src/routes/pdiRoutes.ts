import express from 'express';
import { PdiController } from '../controller/pdiController';
const pdiController = new PdiController();
const pdiRouter = express.Router();

pdiRouter.post('/', (req, res) => pdiController.criarPdi(req, res));
pdiRouter.get('/', (req, res) => pdiController.listarPDIs(req, res));
pdiRouter.delete('/:id', (req, res) => pdiController.deletarPDI(req, res));
export default pdiRouter;
