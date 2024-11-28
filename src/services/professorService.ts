import { In } from 'typeorm';
import { Professor } from '../entities/professorEntities';
import { Membros } from '../entities/membrosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
import { criptografarSenha } from '../utils/senhaUtils';
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
    adminCriadorId: number | null
  ) {
    await this.iniciarDatabase();

    // Buscar turmas associadas
    const turmas = await this.turmaRepository.find({
      where: { id: In(dadosProfessor.turma) }
    });

    if (turmas.length !== dadosProfessor.turma.length) {
      throw ErrorHandler.notFound('Algumas turmas não foram encontradas.');
    }

    const senhaCriptografada = await criptografarSenha(dadosProfessor.numeroMatricula)

    // Criar o membro
    const membro = this.membrosRepository.create({
      email: dadosProfessor.email,
      senha: senhaCriptografada,
      nomeCompleto: dadosProfessor.nomeCompleto,
      numeroMatricula: dadosProfessor.numeroMatricula,
      cpf: dadosProfessor.cpf,
      tipoConta: TipoConta.PROFESSOR,
      adminCriadorId: adminCriadorId ? { id: adminCriadorId } : null
    });

    await this.membrosRepository.save(membro);

    // Criar o professor associado ao membro
    const professor = this.professorRepository.create({
      membro,
      turmas
    });

    const novoProfessor = await this.professorRepository.save(professor);

    return novoProfessor;
  }

  async listarProfessores() {
    await this.iniciarDatabase();

    return await this.professorRepository.find({
      relations: ['membro']
    });
  }

  async buscarProfessorPorId(id: number) {
    await this.iniciarDatabase();

    const professor = await this.professorRepository.findOne({
      where: { id },
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
      nomeCompleto?: string;
      numeroMatricula?: string;
      cpf?: string;
      turma?: number[];
    }>
  ) {
    await this.iniciarDatabase();

    const professorExistente = await this.professorRepository.findOne({
      where: { id },
      relations: ['membro', 'turmas']
    });

    if (!professorExistente) {
      throw ErrorHandler.notFound('Professor não encontrado.');
    }

    const membro = professorExistente.membro;
    const senhaCriptografada = await criptografarSenha(membro.numeroMatricula);

    // Atualizar os dados do membro
    Object.assign(membro, {
      email: dadosProfessor.email ?? membro.email,
      nomeCompleto: dadosProfessor.nomeCompleto ?? membro.nomeCompleto,
      cpf: dadosProfessor.cpf ?? membro.cpf,
      numeroMatricula: dadosProfessor.numeroMatricula ?? membro.numeroMatricula,
      senha: senhaCriptografada
    });

    await this.membrosRepository.save(membro);

    // Atualizar as turmas, se necessário
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

    // Salvar alterações no professor
    await this.professorRepository.save(professorExistente);

    return await this.professorRepository.findOne({
      where: { id },
      relations: ['membro', 'turmas']
    });
  }

  async deletarProfessor(id: number) {
    await this.iniciarDatabase();

    const professorExistente = await this.professorRepository.findOne({
      where: { id },
      relations: ['membro']
    });

    if (!professorExistente) {
      throw ErrorHandler.notFound('Professor não encontrado.');
    }

    if (professorExistente.membro) {
      await this.membrosRepository.remove(professorExistente.membro);
    }

    await this.professorRepository.remove(professorExistente);
  }
}
