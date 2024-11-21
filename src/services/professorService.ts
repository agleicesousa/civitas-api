import { getRepository } from 'typeorm';
import { Professor } from '../entities/professorEntities';
import { Membros } from '../entities/membrosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
import ErrorHandler from '../errors/errorHandler';
import { criptografarSenha } from '../utils/senhaUtils';

export class ProfessorService {
  private professorRepository = getRepository(Professor);
  private membrosRepository = getRepository(Membros);
  private turmaRepository = getRepository(Turma);

  async criarProfessor(
    nomeMembro: string,
    cpf: string,
    dataNascimento: Date,
    numeroMatricula: string,
    turmasApelido: string,
    email: string,
    senha: string,
    adminId: number,
    turmaIds: number[]
  ): Promise < Professor > {
    // Verifica se o e-mail já está registrado
    const membroExistente = await this.membrosRepository.findOne({ where: { email } });
    if (membroExistente) {
      throw ErrorHandler.badRequest('Email já registrado');
    }

    // Cria o novo membro
    const membro = new Membros();
    membro.nomeCompleto = nomeMembro;
    membro.cpf = cpf;
    membro.dataNascimento = dataNascimento;
    membro.numeroMatricula = numeroMatricula;
    membro.email = email;
    membro.senha = await criptografarSenha(senha);
    membro.tipoConta = TipoConta.PROFESSOR;

    await this.membrosRepository.save(membro);

    // Verifica se todas as turmas existem
    const turmas = await this.turmaRepository.findByIds(turmaIds);
    if (turmas.length !== turmaIds.length) {
      throw ErrorHandler.notFound('Algumas turmas não foram encontradas');
    }

    // Cria o novo professor
    const professor = new Professor();
    professor.membro = membro;
    professor.turmas = turmas;
    professor.adminId = adminId;

    await this.professorRepository.save(professor);

    return professor;
  }

  async editarProfessor(
    professorId: number,
    adminId: number,
    email: string,
    senha: string,
    turmaIds: number[]
  ): Promise < Professor > {
    // Busca o professor com base no ID e nas relações com admin, membro e turmas
    const professor = await this.professorRepository.findOne({
      where: { id: professorId },
      relations: ['admin', 'membro', 'turmas']
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    // Verifica se o admin que está fazendo a edição é o mesmo que criou o professor.
    if (professor.admin.id !== adminId) {
      throw ErrorHandler.forbidden(
        'Você não tem permissão para editar esse professor'
      );
    }

    if (email) {
      professor.membro.email = email;
    }

    if (senha) {
      professor.membro.senha = await criptografarSenha(senha);
    }

    // Verifica se as turmas existem
    const turmas = await this.turmaRepository.findByIds(turmaIds);
    if (turmas.length !== turmaIds.length) {
      throw ErrorHandler.notFound('Algumas turmas não foram encontradas');
    }

    professor.turmas = turmas;

    await this.professorRepository.save(professor);

    return professor;
  }

  async listarProfessores(adminId: number): Promise < Professor[] > {
    const professores = await this.professorRepository.find({
      where: { adminId },
      relations: ['membro', 'turmas']
    });

    if (professores.length === 0) {
      throw ErrorHandler.notFound('Nenhum professor encontrado');
    }

    return professores;
  }

  async buscarProfessorPorId(
    professorId: number,
    adminId: number
  ): Promise < Professor > {
    const professor = await this.professorRepository.findOne({
      where: { id: professorId, adminId },
      relations: ['membro', 'turmas']
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    return professor;
  }

  async deletarProfessor(professorId: number, adminId: number): Promise < void > {
    const professor = await this.professorRepository.findOne({
      where: { id: professorId, adminId }
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    await this.professorRepository.remove(professor);
  }
}
