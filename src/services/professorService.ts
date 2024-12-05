import { In } from 'typeorm';
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
      throw ErrorHandler.notFound('Algumas turmas não foram encontradas.');
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
    return novoProfessor;
  }

  async listarProfessores(adminLogadoId: number) {
    await this.iniciarDatabase();

    return await this.professorRepository.find({
      where: {
        membro: {
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro']
    });
  }

  async buscarProfessorPorId(id: number, adminLogadoId: number) {
    await this.iniciarDatabase();

    const professor = await this.professorRepository.findOneOrFail({
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

    if (professor.membro.adminCriadorId !== adminLogadoId) {
      throw ErrorHandler.badRequest(
        'Você não tem permissão para acessar este professor.'
      );
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

    if (membro.adminCriadorId !== adminLogadoId) {
      throw ErrorHandler.badRequest(
        'Você não pode atualizar um professor que não foi criado por você.'
      );
    }

    const senhaCriptografada = await criptografarSenha(
      dadosProfessor.numeroMatricula ?? membro.numeroMatricula
    );

    Object.assign(membro, {
      email: dadosProfessor.email ?? membro.email,
      nomeCompleto: dadosProfessor.nomeCompleto ?? membro.nomeCompleto,
      cpf: dadosProfessor.cpf ?? membro.cpf,
      numeroMatricula: dadosProfessor.numeroMatricula ?? membro.numeroMatricula,
      senha: senhaCriptografada
    });

    if (dadosProfessor.senha) {
      membro.senha = await criptografarSenha(dadosProfessor.senha);
    }

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

    return await this.professorRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro', 'turmas']
    });
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

    if (professorExistente.membro.adminCriadorId !== adminLogadoId) {
      throw ErrorHandler.badRequest(
        'Você não pode excluir um professor que não foi criado por você.'
      );
    }

    // Excluir membro associado primeiro
    if (professorExistente.membro) {
      await this.membrosRepository.remove(professorExistente.membro);
    }

    await this.professorRepository.remove(professorExistente);
  }
}
