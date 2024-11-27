import express from 'express';
import { criarPDI, listarPDIs } from '../controller/pdiController';

const pdiRouter = express.Router();

pdiRouter.post('/pdi', criarPDI);
pdiRouter.get('/pdi', listarPDIs);
export default pdiRouter;
