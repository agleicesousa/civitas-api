import { Professor } from '../entities/professorEntities';
import { Membros } from '../entities/membrosEntities';
import { Turma } from '../entities/turmasEntities';
import { Admin } from '../entities/adminEntities';
import ErrorHandler from '../errors/errorHandler';
import { TipoConta } from '../entities/baseEntity';
import { criptografarSenha } from '../utils/senhaUtils';

export class ProfessorService {
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
  ): Promise<Professor> {
    // Verifica se o e-mail já está registrado
    const membroExistente = await Membros.findOne({ where: { email } });
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

    await membro.save();

    // Verifica se todas as turmas existem
    const turmas = await Turma.findByIds(turmaIds);
    if (turmas.length !== turmaIds.length) {
      throw ErrorHandler.notFound('Algumas turmas não foram encontradas');
    }

    // Cria o novo professor
    const professor = new Professor();
    professor.membro = membro;
    professor.turmas = turmas;
    professor.adminId = adminId;

    await professor.save();

    return professor;
  }

  async editarProfessor(
    professorId: number,
    adminId: number,
    email: string,
    senha: string,
    turmaIds: number[]
  ): Promise<Professor> {
    // Busca o professor com base no ID e nas relações com admin, membro e turmas
    const professor = await Professor.findOne({
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

    const turmas = await Turma.findByIds(turmaIds);
    if (turmas.length !== turmaIds.length) {
      throw ErrorHandler.notFound('Algumas turmas não foram encontradas');
    }

    professor.turmas = turmas;

    await professor.save();

    return professor;
  }

  async listarProfessores(adminId: number): Promise<Professor[]> {
    const professores = await Professor.find({
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
  ): Promise<Professor> {
    const professor = await Professor.findOne({
      where: { id: professorId, adminId },
      relations: ['membro', 'turmas']
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    return professor;
  }

  async deletarProfessor(professorId: number, adminId: number): Promise<void> {
    const professor = await Professor.findOne({
      where: { id: professorId, adminId }
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    await professor.remove();
  }
}
