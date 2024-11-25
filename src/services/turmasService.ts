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

/**
 * Classe para gerenciar operações relacionadas a turmas.
 */
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
  /**
   * Cria uma nova turma com os dados fornecidos.
   *
   * @param dadosTurma - Dados da turma a ser criada. Pode ser um objeto parcial da entidade `Turma`.
   * @returns A turma criada.
   */
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
  /**
   * Lista todas as turmas cadastradas.
   *
   * @returns Uma promessa que resolve para um array de turmas.
   */
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
  /**
   * Atualiza uma turma existente.
   *
   * @param id - O ID da turma a ser atualizada.
   * @param dadosTurma - Dados atualizados da turma. Pode ser um objeto parcial da entidade `Turma`.
   * @returns A turma atualizada ou null se não encontrada.
   */
  async editar(id: number, dadosTurma: Partial<Turma>) {
    const turmaExistente = await this.turmasRepository.findOneBy({ id });
    const { turmaApelido } = dadosTurma;

    if (turmaApelido && turmaApelido.length > 12) {
      throw ErrorHandler.badRequest('O apelido da turma é muito longo');
    }

    Object.assign(turmaExistente, dadosTurma);
    return await this.turmasRepository.save(turmaExistente);
  }

  /**
   * Deleta uma turma pelo ID.
   *
   * @param id - O ID da turma a ser deletada (pode ser string ou number).
   * @returns Uma promessa que resolve para o resultado da operação de exclusão
   */
  async deletar(id: number) {
    return await this.turmasRepository.delete(id);
  }

  /**
   * Busca uma turma específica pelo ID.
   *
   * @param id - O ID da turma a ser buscada (pode ser string ou number).
   * @returns A turma encontrada ou null se não encontrada.
   */
  async buscarPorId(id: number): Promise<Turma | null> {
    return await this.turmasRepository.findOneBy({ id });
  }
}
