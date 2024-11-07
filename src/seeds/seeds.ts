import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Admin } from '../entities/adminEntities';
import { Alunos } from '../entities/alunosEntities';
import { TipoConta } from '../entities/baseEntity';
import { Membros } from '../entities/membrosEntities';
import { Professor } from '../entities/professorEntities';
import { Responsaveis } from '../entities/responsaveisEntities';
import { Turma } from '../entities/turmasEntities';

const QUANTIDADE_MEMBROS = 50;
const QUANTIDADE_TURMAS = 5;

export class Seeds implements Seeder {
  private membrosRepository!: Repository<Membros>;
  private adminRepository!: Repository<Admin>;
  private alunosRepository!: Repository<Alunos>;
  private responsavelRepository!: Repository<Responsaveis>;
  private professorRepository!: Repository<Professor>;
  private turmaRepository!: Repository<Turma>;

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    this.membrosRepository = dataSource.getRepository(Membros);
    this.adminRepository = dataSource.getRepository(Admin);
    this.alunosRepository = dataSource.getRepository(Alunos);
    this.responsavelRepository = dataSource.getRepository(Responsaveis);
    this.professorRepository = dataSource.getRepository(Professor);
    this.turmaRepository = dataSource.getRepository(Turma);

    await this.seedMembros(dataSource, factoryManager);
    await this.seedAdmin(dataSource, factoryManager);
    await this.seedProfessor(dataSource, factoryManager);
    await this.seedResponsavel(dataSource, factoryManager);
    await this.seedAlunos(dataSource, factoryManager);
    await this.seedTurmas(dataSource, factoryManager);
  }

  private async seedTurmas(_, factoryManager: SeederFactoryManager) {
    const turmasFactory = factoryManager.get(Turma);

    let qtdTurma = 0;
    while (QUANTIDADE_TURMAS > qtdTurma) {
      const admin = await this.adminRepository
        .createQueryBuilder('adm')
        .orderBy('RAND()')
        .getOne();

      const alunos =
        (await this.alunosRepository.find({
          where: { turma: null },
          take: 2
        })) || [];

      const professores =
        (await this.professorRepository
          .createQueryBuilder('professor')
          .leftJoinAndSelect('professor.turmas', 'turma')
          .where('turma.id IS NULL')
          .take(2)
          .getMany()) || [];

      if (admin && alunos.length && professores.length) {
        const turma = await turmasFactory.make({ admin, professores, alunos });

        await this.turmaRepository.save(turma);
        qtdTurma++;
      } else {
        break;
      }
    }
  }

  private async seedAlunos(_, factoryManager: SeederFactoryManager) {
    const alunosFactory = factoryManager.get(Alunos);

    const membros = await this.membrosRepository.find({
      where: { tipoConta: TipoConta.ALUNO }
    });

    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .orderBy('RAND()')
      .getOne();

    const responsavel = await this.responsavelRepository
      .createQueryBuilder('responsavel')
      .orderBy('RAND()')
      .getOne();

    if (membros.length) {
      for (const membro of membros) {
        const membroExiste = await this.alunosRepository.findOne({
          where: { membro: { id: membro.id } }
        });

        if (!membroExiste) {
          const aluno = await alunosFactory.make({
            membro,
            admin,
            responsavel
          });
          await this.alunosRepository.save(aluno);
        }
      }
    }
  }

  private async seedResponsavel(_, factoryManager: SeederFactoryManager) {
    const responsavelFactory = factoryManager.get(Responsaveis);

    const membros = await this.membrosRepository.find({
      where: { tipoConta: TipoConta.RESPONSAVEL }
    });

    const admin = await this.membrosRepository
      .createQueryBuilder('membro')
      .where('membro.tipoConta = :tipo', { tipo: TipoConta.ADMIN })
      .orderBy('RAND()')
      .getOne();

    if (membros.length) {
      for (const membro of membros) {
        const membroExiste = await this.responsavelRepository.findOne({
          where: { membro: { id: membro.id } }
        });

        if (!membroExiste) {
          const responsavel = await responsavelFactory.make({ membro, admin });
          await this.responsavelRepository.save(responsavel);
        }
      }
    }
  }

  private async seedProfessor(_, factoryManager: SeederFactoryManager) {
    const professorFactory = factoryManager.get(Professor);

    const membros = await this.membrosRepository.find({
      where: { tipoConta: TipoConta.PROFESSOR }
    });

    const adminSemProfessor = await this.adminRepository.findOne({
      where: {
        professores: []
      }
    });

    if (membros.length) {
      for (const membro of membros) {
        const membroExiste = await this.professorRepository.findOne({
          where: { membro: { id: membro.id } }
        });

        if (!membroExiste && adminSemProfessor) {
          const professor = await professorFactory.make({
            membro,
            admin: adminSemProfessor
          });
          await this.professorRepository.save(professor);
        }
      }
    }
  }

  private async seedAdmin(_, factoryManager: SeederFactoryManager) {
    const adminFactory = factoryManager.get(Admin);

    const membros = await this.membrosRepository.find({
      where: { tipoConta: TipoConta.ADMIN }
    });

    if (membros.length) {
      for (const membro of membros) {
        const membroExiste = await this.adminRepository.findOne({
          where: { membro: { id: membro.id } }
        });

        if (!membroExiste) {
          const admin = await adminFactory.make({ membro });
          await this.adminRepository.save(admin);
        }
      }
    }
  }

  private async seedMembros(_, factoryManager: SeederFactoryManager) {
    const membrosFactory = factoryManager.get(Membros);

    const quantidadeMembrosExistentes = await this.membrosRepository.count();

    if (quantidadeMembrosExistentes === 0)
      await this.membrosRepository.save(
        await membrosFactory.saveMany(QUANTIDADE_MEMBROS)
      );
  }
}
