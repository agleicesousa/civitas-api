import { Request, Response } from 'express';
import { PdiService } from '../services/pdiService';
import { MysqlDataSource } from '../config/database';
const pdiService = new PdiService();
import { PDI } from '../entities/pdiEntities';
export async function criarPDI(req: Request, res: Response) {
  try {
    const { studentId, pdiValues, comments } = req.body;

    const pdi = await pdiService.criarPDI({ pdiValues }, comments, studentId);

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

export const listarPDIs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pdiRepository = MysqlDataSource.getRepository(PDI);

    // Busca todos os PDIs
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

    // Retorna os PDIs encontrados
    return res.status(200).json({ message: 'PDIs encontrados', data: pdIs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar PDIs' });
  }
};
