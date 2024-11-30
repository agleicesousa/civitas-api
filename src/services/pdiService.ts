import { Alunos } from '../entities/alunosEntities';
import { PDI, PdiSecao, PdiResposta } from '../entities/pdiEntities';
import { MysqlDataSource } from '../config/database';
import { NivelDeSatisfacao } from '../entities/pdiEntities';
import { Professor } from '../entities/professorEntities';
import ErrorHandler from '../errors/errorHandler';

interface CreatePDIPayload {
  pdiValues: {
    section: string;
    [key: string]: string | NivelDeSatisfacao;
  }[];
}

export class PdiService {
  private alunosRepository = MysqlDataSource.getRepository(Alunos);
  private pdiRepository = MysqlDataSource.getRepository(PDI);
  private professorRepository = MysqlDataSource.getRepository(Professor);

  private pdiMap(pdi: PDI) {
    const comments = pdi.consideracoes;
    const responses = {};
    pdi.secoes.forEach((secao) => {
      secao.respostas.forEach((resposta) => {
        responses[resposta.pergunta] = Number(resposta.valor);
      });
    });
    const averages = pdi.secoes.map((secao) => Number(secao.media));
    const registrationDate = pdi.dataCriacao;

    return {
      ...responses,
      averages,
      registrationDate,
      comments
    };
  }

  async criarPDI(
    payload: CreatePDIPayload,
    comments: string,
    alunoId: number,
    professorId: number
  ): Promise<PDI> {
    const [aluno, professor] = await Promise.all([
      this.alunosRepository.findOne({
        where: { id: alunoId }
      }),
      this.professorRepository.findOne({
        where: {
          membro: {
            id: professorId
          }
        }
      })
    ]);

    if (!professor) {
      throw ErrorHandler.badRequest('Professor não encontrado');
    }

    if (!aluno) {
      throw ErrorHandler.badRequest('Aluno não encontrado');
    }

    const pdi = new PDI();
    pdi.secoes = [];
    pdi.aluno = aluno;
    pdi.consideracoes = comments;
    pdi.professor = professor;
    pdi.secoes = await Promise.all(
      payload.pdiValues.map((sectionData) =>
        this.criarSecaoComRespostas(sectionData)
      )
    );

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

  private async criarSecaoComRespostas(sectionData): Promise<PdiSecao> {
    const secao = new PdiSecao();
    secao.titulo = sectionData.section;
    secao.respostas = [];

    // Prepara os dados das respostas
    const respostasPromises = Object.entries(sectionData)
      .filter(([key]) => key !== 'section')
      .map(([key, value]) => {
        const resposta = new PdiResposta();
        resposta.pergunta = key;
        resposta.valor = value as NivelDeSatisfacao;
        return resposta;
      });

    // Insere todas as respostas em paralelo
    secao.respostas = await Promise.all(respostasPromises);
    return secao;
  }

  async detalhesPDI(idPDI: number) {
    const pdi = await this.pdiRepository.findOne({
      where: { id: idPDI },
      relations: ['secoes']
    });

    if (!pdi) {
      throw ErrorHandler.notFound('PDI não encontrado');
    }
    const idPdiAnterior = idPDI - 1;
    const pdiAnterior = await this.pdiRepository.findOne({
      relations: ['secoes'],
      where: {
        id: idPdiAnterior
      }
    });
    console.log(pdiAnterior);

    const pdiDetalhes = this.pdiMap(pdi);

    const mediasAnteriores =
      pdiAnterior?.secoes.map((secao) => Number(secao.media)) ?? [];

    return {
      ...pdiDetalhes,
      previousIdpAverages: mediasAnteriores
    };
  }

  async listaPdis(alunoId: number) {
    const pdis = await this.pdiRepository.find({
      where: {
        aluno: {
          id: alunoId
        }
      },
      order: { dataCriacao: 'DESC' },
      select: ['id', 'dataCriacao']
    });

    if (!pdis.length) {
      return [];
    }

    return pdis.map((pdi: PDI) => ({
      id: pdi.id,
      registrationDate: new Date(pdi.dataCriacao).toLocaleDateString('pt-BR')
    }));
  }
}
