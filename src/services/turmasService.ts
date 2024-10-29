import {
  AnoLetivo,
  PeriodoLetivo,
  TipoEnsino,
  Turma
} from '../entities/turmasEntities';
// import { Aluno } from '../entities/alunoEntities';
import { Admin } from '../entities/adminEntities';
// import { Professor } from '../entities/professorEntities';
import { MysqlDataSource } from '../config/database';
// import { In } from 'typeorm';

/**
 * Classe para gerenciar operações relacionadas a turmas.
 */
export class TurmasService {
  private turmasRepository = MysqlDataSource.getRepository(Turma);
  private adminRepository = MysqlDataSource.getRepository(Admin);
  // private professorRepository = MysqlDataSource.getRepository(Professor);
  // private alunoRepository = MysqlDataSource.getRepository(Aluno);

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
      where: { turmaApelido }
    });

    if (turmaExistente) {
      throw new Error(`Já existe uma turma com o apelido ${turmaApelido}`);
    }

    const admin = await this.adminRepository.findOneBy({ id: adminId });

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
  async listar(): Promise<Turma[]> {
    return await this.turmasRepository.find();
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
