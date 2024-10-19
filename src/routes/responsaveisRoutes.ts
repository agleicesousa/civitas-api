import { Router } from 'express';
import { ResponsaveisController } from '../controller/responsaveisController';

const responsaveisRouter = Router();
const responsaveisController = new ResponsaveisController();

responsaveisRouter.get('/', responsaveisController.listarResponsaveis);
responsaveisRouter.get('/:id', responsaveisController.buscarResponsavelPorId);
responsaveisRouter.post('/', responsaveisController.criarResponsavel);

export default responsaveisRouter;
