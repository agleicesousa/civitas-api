import { In } from 'typeorm';
import { Professor } from '../entities/professorEntities';
import { Membros } from '../entities/membrosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
import ErrorHandler from '../errors/errorHandler';
import { criptografarSenha } from '../utils/senhaUtils';
import { MysqlDataSource } from '../config/database';

export class ProfessorService {
  private professorRepository = MysqlDataSource.getRepository(Professor);
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private turmaRepository = MysqlDataSource.getRepository(Turma);

  async criarProfessor(
    nomeMembro: string,
    cpf: string,
    dataNascimento: Date,
    numeroMatricula: string,
    email: string,
    senha: string,
    adminId: number,
    turmaIds: number[]
  ): Promise<Professor> {
    const membroExistente = await this.membrosRepository.findOne({
      where: { email }
    });
    if (membroExistente) {
      throw ErrorHandler.badRequest('Email já registrado');
    }

    const membro = this.membrosRepository.create({
      nomeCompleto: nomeMembro,
      cpf,
      dataNascimento,
      numeroMatricula,
      email,
      senha: await criptografarSenha(senha),
      tipoConta: TipoConta.PROFESSOR
    });

    await this.membrosRepository.save(membro);

    const turmas = await this.turmaRepository.find({
      where: { id: In(turmaIds) }
    });
    if (turmas.length !== turmaIds.length) {
      throw ErrorHandler.notFound('Algumas turmas não foram encontradas');
    }

    const professor = this.professorRepository.create({
      membro,
      turmas,
      adminId
    });

    await this.professorRepository.save(professor);
    return professor;
  }

  async editarProfessor(
    professorId: number,
    adminId: number,
    email: string,
    senha: string,
    turmaIds: number[]
  ): Promise<Professor> {
    const professor = await this.professorRepository.findOne({
      where: { id: professorId },
      relations: ['admin', 'membro', 'turmas']
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    if (professor.admin.id !== adminId) {
      throw ErrorHandler.forbidden(
        'Você não tem permissão para editar esse professor'
      );
    }

    if (email) professor.membro.email = email;
    if (senha) professor.membro.senha = await criptografarSenha(senha);

    const turmas = await this.turmaRepository.find({
      where: { id: In(turmaIds) }
    });
    if (turmas.length !== turmaIds.length) {
      throw ErrorHandler.notFound('Algumas turmas não foram encontradas');
    }

    professor.turmas = turmas;

    await this.professorRepository.save(professor);
    return professor;
  }

  async listarProfessores(adminId: number): Promise<Professor[]> {
    const professores = await this.professorRepository.find({
      where: { adminId },
      relations: ['membro', 'turmas']
    });

    if (!professores.length) {
      throw ErrorHandler.notFound('Nenhum professor encontrado');
    }

    return professores;
  }

  async buscarProfessorPorId(
    professorId: number,
    adminId: number
  ): Promise<Professor> {
    const professor = await this.professorRepository.findOne({
      where: { id: professorId, adminId },
      relations: ['membro', 'turmas']
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    return professor;
  }

  async deletarProfessor(professorId: number, adminId: number): Promise<void> {
    const professor = await this.professorRepository.findOne({
      where: { id: professorId, adminId }
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    await this.professorRepository.remove(professor);
  }
}
