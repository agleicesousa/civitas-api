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
    const registrationDate = new Date(pdi.dataCriacao).toLocaleDateString(
      'pt-BR'
    );

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
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    if (!aluno) {
      throw ErrorHandler.notFound('Aluno não encontrado');
    }

    const pdi = new PDI();
    pdi.aluno = aluno;
    pdi.consideracoes = comments;
    pdi.professor = professor;
    pdi.secoes = payload.pdiValues.map((sectionData) =>
      this.criarSecaoComRespostas(sectionData)
    );
    const novoPdi = await this.pdiRepository.save(pdi);

    aluno.desempenho = aluno.calcularDesempenho(pdi.secoes);
    await this.alunosRepository.save(aluno);

    return novoPdi;
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

  private criarSecaoComRespostas(sectionData): PdiSecao {
    const secao = new PdiSecao();
    secao.titulo = sectionData.section;
    secao.respostas = Object.entries(sectionData)
      .filter(([key]) => key !== 'section')
      .map(([key, value]) => {
        const resposta = new PdiResposta();
        resposta.pergunta = key;
        resposta.valor = value as NivelDeSatisfacao;
        return resposta;
      });

    return secao;
  }
  async detalhesPDI(idPDI: number) {
    const pdi = await this.pdiRepository.findOne({
      where: { id: idPDI },
      relations: ['secoes', 'aluno', 'professor', 'aluno.turma']
    });
    const aluno = pdi.aluno;
    const professor = pdi.professor;

    if (!pdi) {
      throw ErrorHandler.notFound('PDI não encontrado');
    }

    const todosPdi = await this.pdiRepository.find({
      where: { aluno: { id: pdi.aluno.id } },
      relations: ['secoes'],
      order: { dataCriacao: 'ASC' }
    });
    const currentPdiIndex = todosPdi.findIndex((p) => p.id === idPDI);
    const pdiAnterior =
      currentPdiIndex > 0 ? todosPdi[currentPdiIndex - 1] : null;

    const pdiDetalhes = this.pdiMap(pdi);

    const mediasAnteriores = pdiAnterior
      ? pdiAnterior.secoes.map((secao) => Number(secao.media))
      : [];
    return {
      ...pdiDetalhes,
      studentName: aluno.membro.nomeCompleto,
      classroomName: aluno.turma ? aluno.turma.turmaApelido : 'Sem Turma',
      teacherName: professor.membro.nomeCompleto,
      enrollmentNumber: aluno.membro.numeroMatricula,
      previousIdpAverages: mediasAnteriores
    };
  }

  async pdisDoAluno(alunoId: number) {
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

  async resumoProfessorAluno(alunoId: number, professorId: number) {
    const [aluno, professor] = await Promise.all([
      this.alunosRepository.findOne({
        where: { id: alunoId },
        relations: ['membro', 'turma']
      }),
      this.professorRepository.findOne({
        where: { membro: { id: professorId } },
        relations: ['membro']
      })
    ]);

    if (!aluno) {
      throw ErrorHandler.notFound('Aluno não encontrado');
    }

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    return {
      classroomName: aluno.turma ? aluno.turma.turmaApelido : 'Sem turma',
      studentName: aluno.membro.nomeCompleto,
      teacherName: professor.membro.nomeCompleto,
      enrollmentNumber: aluno.membro.numeroMatricula
    };
  }
}
