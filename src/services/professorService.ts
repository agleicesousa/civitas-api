import { In } from 'typeorm';
import { Professor } from '../entities/professorEntities';
import { Membros } from '../entities/membrosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
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
    const turmasRepository = MysqlDataSource.getRepository(Turma);

    const turmas = await turmasRepository.find({
      where: { id: In(dadosProfessor.turmasId) }
    });

    if (turmas.length !== dadosProfessor.turmasId.length) {
      throw ErrorHandler.notFound('Algumas turmas não foram encontradas.');
    }

    const membro = membrosRepository.create({
      email: dadosProfessor.email,
      nomeCompleto: dadosProfessor.nomeCompleto,
      numeroMatricula: dadosProfessor.numeroMatricula,
      tipoConta: TipoConta.PROFESSOR,
      adminCriadorId: adminCriadorId ? { id: adminCriadorId } : null
    });

    await membrosRepository.save(membro);

    const professor = professorRepository.create({
      membro,
      turmas
    });

    return await professorRepository.save(professor);
  }
}
