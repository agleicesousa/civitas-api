import { Request, Response } from 'express';
import { PdiService } from '../services/pdiService';
import ErrorHandler from '../errors/errorHandler';
export class PdiController {
  private pdiService = new PdiService();

  async criarPdi(req: Request, res: Response) {
    try {
      const { pdiValues, comments } = req.body;
      const alunoId = Number(req.params.id);
      const professorId = req.user?.id;
      const pdi = await this.pdiService.criarPDI(
        { pdiValues },
        comments,
        alunoId,
        professorId
      );

      return res.status(201).json({
        message: 'PDI cadastrado com sucesso',
        data: pdi
      });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      return res.status(500).json({
        message:
          'Não foi possível carregar as informações. Erro interno do servidor.'
      });
    }
  }

  async obterDetalhesPDI(req: Request, res: Response): Promise<Response> {
    try {
      const idPDI = Number(req.params.id);
      if (isNaN(idPDI)) {
        res
          .status(400)
          .json({ message: 'O ID do PDI deve ser um número válido' });
        return;
      }
      const detalhes = await this.pdiService.detalhesPDI(idPDI);
      res.status(200).json(detalhes);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      return res.status(500).json({
        message:
          'Não foi possível carregar as informações. Erro interno do servidor.'
      });
    }
  }

  async listarPDIs(req: Request, res: Response): Promise<Response> {
    try {
      const alunoId = Number(req.params.id);
      const pdis = await this.pdiService.listaPdis(alunoId);
      return res.status(200).json(pdis);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao listar PDIs' });
    }
  }

  async deletarPDI(req: Request, res: Response): Promise<Response> {
    try {
      const pdiId = Number(req.params.id);
      await this.pdiService.deletearPdi(pdiId);
      return res.status(200).json({
        message: 'PDI removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover PDI:', error.message);

      return res.status(400).json({
        message: 'Erro ao remover PDI',
        error: error.message
      });
    }
  }
}
