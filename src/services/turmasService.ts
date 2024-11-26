import {
  AnoLetivo,
  PeriodoLetivo,
  TipoEnsino,
  Turma
} from '../entities/turmasEntities';
import { Admin } from '../entities/adminEntities';
import { Like } from 'typeorm';
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
    adminId: number
  ): Promise<Turma> {
    const turmaExistente = await this.turmasRepository.findOne({
      where: {
        turmaApelido,
        admin: {
          membro: { id: adminId }
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
      membro: { id: adminId }
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
    adminId: number,
    paginaNumero: number,
    paginaTamanho: number | null,
    searchTerm: string
  ) {
    const offset = (paginaNumero - 1) * (paginaTamanho ?? 0);
    const [turmas, total] = await this.turmasRepository.findAndCount({
      where: {
        admin: {
          membro: { id: adminId }
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

  async editar(id: number, dadosTurma: Partial<Turma>) {
    const turmaExistente = await this.turmasRepository.findOneBy({ id });
    const { turmaApelido } = dadosTurma;

    if (turmaApelido && turmaApelido.length > 12) {
      throw ErrorHandler.badRequest('O apelido da turma é muito longo');
    }

    Object.assign(turmaExistente, dadosTurma);
    return await this.turmasRepository.save(turmaExistente);
  }

  async deletar(id: number) {
    return await this.turmasRepository.delete(id);
  }

  async buscarPorId(id: number): Promise<Turma | null> {
    return await this.turmasRepository.findOneBy({ id });
  }
}
