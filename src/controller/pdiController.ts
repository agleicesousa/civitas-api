import { Request, Response } from 'express';
import { PdiService } from '../services/pdiService';
import { MysqlDataSource } from '../config/database';
import { PDI } from '../entities/pdiEntities';

export class PdiController {
  private pdiService = new PdiService();

  async criarPdi(req: Request, res: Response) {
    try {
      //TODO:
      //Vincular PDI a professor
      const { studentId, pdiValues, comments } = req.body;

      const pdi = await this.pdiService.criarPDI(
        { pdiValues },
        comments,
        studentId
      );

      return res.status(201).json({
        message: 'PDI criado com sucesso',
        data: pdi
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        message: 'Erro ao criar PDI'
      });
    }
  }

  async listarPDIs(req: Request, res: Response): Promise<Response> {
    try {
      const pdiRepository = MysqlDataSource.getRepository(PDI);

      const pdIs = await pdiRepository
        .createQueryBuilder('pdi')
        .leftJoinAndSelect('pdi.secoes', 'secao')
        .leftJoinAndSelect('secao.respostas', 'resposta')
        .leftJoinAndSelect('pdi.aluno', 'aluno')
        .select([
          'pdi.id',
          'pdi.consideracoes',
          'secao.titulo',
          'secao.media',
          'resposta.pergunta',
          'resposta.valor',
          'aluno.id'
        ])
        .getMany();

      return res.status(200).json({ message: 'PDIs encontrados', data: pdIs });
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
        success: true,
        message: 'PDI removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover PDI:', error.message);

      return res.status(400).json({
        success: false,
        message: 'Erro ao remover PDI',
        error: error.message
      });
    }
  }
}
