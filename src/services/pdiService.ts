import { MysqlDataSource } from '../config/database';
import { Alunos } from '../entities/alunosEntities';
import { TipoConta } from '../entities/baseEntity';
import {
  NivelDeSatisfacao,
  PDI,
  PdiResposta,
  PdiSecao
} from '../entities/pdiEntities';
import { Professor } from '../entities/professorEntities';
import ErrorHandler from '../errors/errorHandler';

interface CreatePDIPayload {
  pdiValues: {
    section: string;
    [key: string]: string | NivelDeSatisfacao;
  }[];
}

/**
 * Service responsável pelo gerenciamento dos PDI (Plano de Desenvolvimento Individual).
 */
export class PdiService {
  private alunosRepository = MysqlDataSource.getRepository(Alunos);
  private pdiRepository = MysqlDataSource.getRepository(PDI);
  private professorRepository = MysqlDataSource.getRepository(Professor);

  /**
   * Mapeia os dados de um PDI para um formato mais amigável.
   * @param pdi O PDI a ser mapeado.
   * @returns Dados formatados incluindo respostas, médias, comentários e data.
   */
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
      'pt-BR',
      { timeZone: 'America/Sao_Paulo' }
    );

    return {
      ...responses,
      averages,
      registrationDate,
      comments
    };
  }

  /**
   * Cria um novo PDI para um aluno.
   * @param payload Dados do PDI, incluindo seções e respostas.
   * @param comments Comentários adicionais para o PDI.
   * @param alunoId ID do aluno associado ao PDI.
   * @param professorId ID do professor que criou o PDI.
   * @returns O PDI recém-criado.
   * @throws ErrorHandler Caso o aluno ou professor não sejam encontrados.
   */
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

  /**
   * Deleta um PDI específico pelo ID.
   * @param pdiId ID do PDI a ser deletado.
   * @throws Error Caso o PDI não seja encontrado.
   */
  async deletearPdi(pdiId: number) {
    const pdi = await this.pdiRepository.findOne({
      where: { id: pdiId }
    });

    if (!pdi) {
      throw new Error('PDI não encontrado');
    }

    await this.pdiRepository.delete(pdiId);
  }

  /**
   * Cria uma seção do PDI com suas respectivas respostas.
   * @param sectionData Dados da seção, incluindo perguntas e respostas.
   * @returns Uma nova instância de PdiSecao.
   */
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

  /**
   * Retorna os detalhes de um PDI específico.
   * @param idPDI ID do PDI.
   * @returns Detalhes do PDI, incluindo histórico de médias anteriores.
   * @throws ErrorHandler Caso o PDI não seja encontrado.
   */
  async detalhesPDI(idPDI: number) {
    const pdi = await this.pdiRepository.findOne({
      where: { id: idPDI },
      relations: ['secoes', 'aluno', 'professor', 'aluno.turma']
    });

    if (!pdi) {
      throw ErrorHandler.notFound('PDI não encontrado');
    }

    const aluno = pdi.aluno;
    const professor = pdi.professor;

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

  /**
   * Retorna a lista de PDIs de um aluno.
   * @param alunoId ID do aluno.
   * @param tipoConta Tipo de conta (ALUNO ou outro).
   * @returns Lista de PDIs do aluno com data de registro.
   */
  async pdisDoAluno(alunoId: number, tipoConta: TipoConta) {
    const where =
      tipoConta === TipoConta.ALUNO
        ? { aluno: { membro: { id: alunoId } } }
        : { aluno: { id: alunoId } };

    const pdis = await this.pdiRepository.find({
      where,
      order: { dataCriacao: 'DESC' },
      select: ['id', 'dataCriacao']
    });

    if (!pdis.length) {
      return [];
    }

    return pdis.map((pdi: PDI) => ({
      id: pdi.id,
      registrationDate: new Date(pdi.dataCriacao).toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
      })
    }));
  }

  /**
   * Retorna um resumo do aluno e professor relacionado.
   * @param alunoId ID do aluno.
   * @param professorId ID do professor.
   * @returns Resumo com nomes e detalhes.
   * @throws ErrorHandler Caso o aluno ou professor não sejam encontrados.
   */
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
