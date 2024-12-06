import {
  AnoLetivo,
  PeriodoLetivo,
  TipoEnsino,
  Turma
} from '../entities/turmasEntities';
import { Admin } from '../entities/adminEntities';
import { Like, Not } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import ErrorHandler from '../errors/errorHandler';

export class TurmasService {
  private turmasRepository = MysqlDataSource.getRepository(Turma);
  private adminRepository = MysqlDataSource.getRepository(Admin);

  private mapTurma(turma: Turma) {
    const { id, turmaApelido, anoLetivo, periodoLetivo } = turma;
    return {
      id,
      turmaApelido,
      anoLetivo,
      periodoLetivo
    };
  }
  async criar(
    anoLetivo: AnoLetivo,
    periodoLetivo: PeriodoLetivo,
    ensino: TipoEnsino,
    turmaApelido: string,
    adminCriadorId: number
  ): Promise<Turma> {
    const turmaExistente = await this.turmasRepository.findOne({
      where: {
        turmaApelido,
        admin: {
          membro: { id: adminCriadorId }
        }
      }
    });

    if (turmaExistente) {
      throw ErrorHandler.conflictError('Turma já foi cadastrada');
    }

    if (turmaApelido.length > 12) {
      throw ErrorHandler.badRequest('O apelido da turma é muito longo');
    }

    const admin = await this.adminRepository.findOneBy({
      membro: { id: adminCriadorId }
    });

    const novaTurma = this.turmasRepository.create({
      anoLetivo,
      periodoLetivo,
      ensino,
      turmaApelido,
      admin
    });

    return await this.turmasRepository.save(novaTurma);
  }

  async listar(
    adminCriadorId: number,
    paginaNumero: number,
    paginaTamanho: number | null,
    searchTerm: string
  ) {
    const offset = (paginaNumero - 1) * (paginaTamanho ?? 0);
    const [turmas, total] = await this.turmasRepository.findAndCount({
      where: {
        admin: {
          membro: { id: adminCriadorId }
        },
        turmaApelido: Like(`%${searchTerm}%`)
      },
      skip: paginaTamanho ? offset : undefined,
      take: paginaTamanho || undefined
    });
    const turmasMap = turmas.map(this.mapTurma);
    return {
      total,
      data: turmasMap
    };
  }

  async buscarTurmaPorId(id: number, adminCriadorId: number): Promise<Turma> {
    const turmaExistente = await this.turmasRepository.findOne({
      where: {
        id,
        admin: {
          membro: { id: adminCriadorId }
        }
      }
    });

    if (!turmaExistente) {
      throw ErrorHandler.notFound(
        'Turma não encontrada ou não pertence ao admin logado.'
      );
    }

    return turmaExistente;
  }

  async editar(id: number, dadosTurma: Partial<Turma>, adminCriadorId: number) {
    const turmaExistente = await this.turmasRepository.findOne({
      where: { id },
      relations: ['admin', 'admin.membro']
    });

    if (!turmaExistente) {
      throw ErrorHandler.notFound('Turma não encontrada');
    }

    if (turmaExistente.admin.membro.id !== adminCriadorId) {
      throw ErrorHandler.unauthorized(
        'Você não tem permissão para editar esta turma'
      );
    }

    if (dadosTurma.turmaApelido) {
      const apelidoExistente = await this.turmasRepository.findOne({
        where: {
          turmaApelido: dadosTurma.turmaApelido,
          id: Not(id)
        }
      });

      if (apelidoExistente) {
        throw ErrorHandler.conflictError('O apelido da turma já existe');
      }
    }

    Object.assign(turmaExistente, dadosTurma);
    return await this.turmasRepository.save(turmaExistente);
  }

  async deletar(id: number) {
    const turma = await this.turmasRepository.findOneBy({ id });

    if (!turma) {
      throw ErrorHandler.notFound('Turma não encontrada');
    }
    return await this.turmasRepository.delete(id);
  }

  async buscarAlunosPorTurma(turmaId: number) {
    const turma = await this.turmasRepository.findOne({
      where: { id: turmaId },
      relations: ['alunos', 'alunos.membro']
    });

    if (!turma) {
      throw ErrorHandler.notFound('Turma não encontrada');
    }

    if (!turma.alunos || turma.alunos.length === 0) {
      return [];
    }

    const listaAlunos = turma.alunos.map((aluno) => ({
      id: aluno.id,
      name: aluno.membro.nomeCompleto,
      performance: aluno.desempenho
    }));

    return listaAlunos;
  }
}
