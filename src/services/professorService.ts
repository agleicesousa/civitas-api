import { In } from 'typeorm';
import { Professor } from '../entities/professorEntities';
import { Membros } from '../entities/membrosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
import { criptografarSenha } from '../utils/senhaUtils';
import ErrorHandler from '../errors/errorHandler';
import { MysqlDataSource } from '../config/database';

export class ProfessorService {
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
      turmasId: number[];
    },
    adminCriadorId: number | null
  ) {
    await this.iniciarDatabase();

    const membrosRepository = MysqlDataSource.getRepository(Membros);
    const professorRepository = MysqlDataSource.getRepository(Professor);
    const turmaRepository = MysqlDataSource.getRepository(Turma);

    // Buscar turmas associadas
    const turmas = await turmaRepository.find({
      where: { id: In(dadosProfessor.turmasId) }
    });

    if (turmas.length !== dadosProfessor.turmasId.length) {
      throw ErrorHandler.notFound('Algumas turmas não foram encontradas.');
    }

    // Criar o membro
    const membro = membrosRepository.create({
      email: dadosProfessor.email,
      nomeCompleto: dadosProfessor.nomeCompleto,
      numeroMatricula: dadosProfessor.numeroMatricula,
      tipoConta: TipoConta.PROFESSOR,
      adminCriadorId: adminCriadorId ? { id: adminCriadorId } : null
    });

    await membrosRepository.save(membro);

    // Criar o professor associado ao membro
    const professor = professorRepository.create({
      membro,
      turmas
    });

    const novoProfessor = await professorRepository.save(professor);

    return novoProfessor;
  }

  async listarProfessores() {
    await this.iniciarDatabase();
    const professorRepository = MysqlDataSource.getRepository(Professor);

    return await professorRepository.find({
      relations: ['membro']
    });
  }

  async buscarProfessorPorId(id: number) {
    await this.iniciarDatabase();
    const professorRepository = MysqlDataSource.getRepository(Professor);

    const professor = await professorRepository.findOne({
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
    dadosProfessor: Partial < {
      email ? : string;
      senha ? : string;
      nomeCompleto ? : string;
      numeroMatricula ? : string;
      turmasIds ? : number[];
    } >
  ) {
    await this.iniciarDatabase();
    const professorRepository = MysqlDataSource.getRepository(Professor);
    const membrosRepository = MysqlDataSource.getRepository(Membros);
    const turmaRepository = MysqlDataSource.getRepository(Turma);
  
    const professorExistente = await professorRepository.findOne({
      where: { id },
      relations: ['membro', 'turmas']
    });
  
    if (!professorExistente) {
      throw ErrorHandler.notFound('Professor não encontrado.');
    }
  
    const membro = professorExistente.membro;
  
    // Atualizar senha (criptografada)
    if (dadosProfessor.senha) {
      dadosProfessor.senha = await criptografarSenha(dadosProfessor.senha);
    }
  
    // Atualizar os campos do membro
    Object.assign(membro, {
      email: dadosProfessor.email ?? membro.email,
      nomeCompleto: dadosProfessor.nomeCompleto ?? membro.nomeCompleto,
      numeroMatricula: dadosProfessor.numeroMatricula ?? membro.numeroMatricula,
    });
  
    await membrosRepository.save(membro);
  
    // Atualizar as turmas associadas (se fornecido)
    if (dadosProfessor.turmasIds) {
      const turmas = await turmaRepository.findBy({
        id: In(dadosProfessor.turmasIds),
      });
  
      if (turmas.length !== dadosProfessor.turmasIds.length) {
        throw ErrorHandler.notFound('Algumas turmas fornecidas não foram encontradas.');
      }
      
      professorExistente.turmas = turmas;
    }
  
    // Salvar alterações no professor
    await professorRepository.save(professorExistente);
  
    return await professorRepository.findOne({
      where: { id },
      relations: ['membro', 'turmas'],
    });
  }
}
