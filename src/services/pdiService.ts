import { Alunos } from '../entities/alunosEntities';
import { PDI, PdiSecao, PdiResposta } from '../entities/pdiEntities';
import { MysqlDataSource } from '../config/database';
import { NivelDeSatisfacao } from '../entities/pdiEntities';

export class PdiService {
  private alunosRepository = MysqlDataSource.getRepository(Alunos);
  private pdiRepository = MysqlDataSource.getRepository(PDI);

  async criarPDI(payload, comments, alunoId: number): Promise<PDI> {
    const aluno = await this.alunosRepository.findOne({
      where: { id: alunoId }
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }
    const pdi = new PDI();
    pdi.secoes = [];
    pdi.aluno = aluno;
    pdi.consideracoes = comments;
    // Processa as seções e respostas
    for (const sectionData of payload.pdiValues) {
      const secao = new PdiSecao();
      secao.titulo = sectionData.section;
      // Cria as respostas para cada seção
      const respostas = Object.entries(sectionData)
        .filter(([key]) => key !== 'section')
        .map(([key, value]) => {
          const resposta = new PdiResposta();
          resposta.pergunta = key;
          resposta.valor = value as NivelDeSatisfacao;
          return resposta;
        }); // Salva a seção e as respostas associadas
      secao.respostas = respostas;
      pdi.secoes.push(secao);
    }
    return await this.pdiRepository.save(pdi);
  }

  async deletearPdi(pdiId: number) {
    const pdi = await this.pdiRepository.findOne({
      where: { id: pdiId }
    });

    if (!pdi) {
      throw new Error('PDI não encontrado');
    }

    await this.pdiRepository.delete(pdiId);
  }
}
