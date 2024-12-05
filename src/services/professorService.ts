import { In, Like } from 'typeorm';
import { Professor } from '../entities/professorEntities';
import { Membros } from '../entities/membrosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
import { criptografarSenha } from '../utils/validarSenhaUtils';
import ErrorHandler from '../errors/errorHandler';
import { MysqlDataSource } from '../config/database';

export class ProfessorService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private professorRepository = MysqlDataSource.getRepository(Professor);
  private turmaRepository = MysqlDataSource.getRepository(Turma);

  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

  private dadosProfessor(professor: Professor) {
    return {
      id: professor.id,
      nomeCompleto: professor.membro.nomeCompleto,
      numeroMatricula: professor.membro.numeroMatricula,
      email: professor.membro.email,
      cpf: professor.membro.cpf,
      turmas: professor.turmas.map((turma) => ({
        id: turma.id,
        anoLetivo: turma.anoLetivo,
        periodoLetivo: turma.periodoLetivo,
        ensino: turma.ensino,
        turmaApelido: turma.turmaApelido
      }))
    };
  }

  async criarProfessor(
    dadosProfessor: {
      email: string;
      nomeCompleto: string;
      numeroMatricula: string;
      cpf: string;
      turma: number[];
    },
    adminCriadorId: number
  ) {
    await this.iniciarDatabase();

    const turmas = await this.turmaRepository.find({
      where: { id: In(dadosProfessor.turma) }
    });

    if (turmas.length !== dadosProfessor.turma.length) {
      throw ErrorHandler.notFound(
        'Algumas turmas fornecidas não foram encontradas.'
      );
    }

    const senhaCriptografada = await criptografarSenha(
      dadosProfessor.numeroMatricula
    );

    const membro = this.membrosRepository.create({
      email: dadosProfessor.email,
      nomeCompleto: dadosProfessor.nomeCompleto,
      numeroMatricula: dadosProfessor.numeroMatricula,
      senha: senhaCriptografada,
      cpf: dadosProfessor.cpf,
      tipoConta: TipoConta.PROFESSOR,
      adminCriadorId
    });

    await this.membrosRepository.save(membro);

    const professor = this.professorRepository.create({
      membro,
      turmas
    });

    const novoProfessor = await this.professorRepository.save(professor);

    return {
      message: 'Professor criado com sucesso!',
      professor: novoProfessor
    };
  }

  async listarProfessores(adminLogadoId: number) {
    await this.iniciarDatabase();

    const professores = await this.professorRepository.find({
      where: {
        membro: {
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro']
    });

    return professores;
  }

  async listarProfessoresPagina(
    paginaNumero: number,
    paginaTamanho: number,
    termoDeBusca: string,
    adminLogadoId: number
  ) {
    const pular = (paginaNumero - 1) * paginaTamanho;

    const [professores, total] = await this.professorRepository.findAndCount({
      relations: ['membro'],
      where: {
        membro: {
          adminCriadorId: adminLogadoId,
          ...(termoDeBusca && { nomeCompleto: Like(`%${termoDeBusca}%`) })
        }
      },
      order: { membro: { nomeCompleto: 'ASC' } },
      skip: pular,
      take: paginaTamanho
    });

    if (professores.length === 0) {
      throw ErrorHandler.notFound(
        termoDeBusca
          ? `Nenhum professor encontrado com o termo "${termoDeBusca}".`
          : 'Nenhum professor cadastrado no momento.'
      );
    }

    return {
      message: 'Professores listados com sucesso.',
      data: professores.map(this.dadosProfessor),
      total
    };
  }

  async buscarProfessorPorId(id: number, adminLogadoId: number) {
    await this.iniciarDatabase();

    const professor = await this.professorRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro']
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado.');
    }

    return professor;
  }

  async atualizarProfessor(
    id: number,
    dadosProfessor: Partial<{
      email?: string;
      senha?: string;
      nomeCompleto?: string;
      numeroMatricula?: string;
      cpf?: string;
      turma?: number[];
    }>,
    adminLogadoId: number
  ) {
    await this.iniciarDatabase();

    const professorExistente = await this.professorRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro', 'turmas']
    });

    if (!professorExistente) {
      throw ErrorHandler.notFound('Professor não encontrado.');
    }

    const membro = professorExistente.membro;

    const senhaCriptografada = await criptografarSenha(
      dadosProfessor.numeroMatricula ?? membro.numeroMatricula
    );

    Object.assign(membro, {
      email: dadosProfessor.email ?? membro.email,
      nomeCompleto: dadosProfessor.nomeCompleto ?? membro.nomeCompleto,
      cpf: dadosProfessor.cpf ?? membro.cpf,
      numeroMatricula: dadosProfessor.numeroMatricula ?? membro.numeroMatricula,
      senha: dadosProfessor.senha
        ? await criptografarSenha(dadosProfessor.senha)
        : senhaCriptografada
    });

    await this.membrosRepository.save(membro);

    if (dadosProfessor.turma) {
      const turmas = await this.turmaRepository.findBy({
        id: In(dadosProfessor.turma)
      });

      if (turmas.length !== dadosProfessor.turma.length) {
        throw ErrorHandler.notFound(
          'Algumas turmas fornecidas não foram encontradas.'
        );
      }

      professorExistente.turmas = turmas;
    }

    await this.professorRepository.save(professorExistente);

    return {
      message: 'Professor atualizado com sucesso!',
      professor: professorExistente
    };
  }

  async deletarProfessor(id: number, adminLogadoId: number) {
    await this.iniciarDatabase();

    const professorExistente = await this.professorRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro']
    });

    if (!professorExistente) {
      throw ErrorHandler.notFound('Professor não encontrado.');
    }

    await this.membrosRepository.remove(professorExistente.membro);
    await this.professorRepository.remove(professorExistente);

    return { message: 'Professor excluído com sucesso!' };
  }
}
