import { Turma } from '../entities/turmasEntities';
import { MysqlDataSource } from '../config/database';

/**
 * Classe para gerenciar operações relacionadas a turmas.
 */
export class TurmasService {
  private repository = MysqlDataSource.getRepository(Turma);

  /**
   * Converte um ID para número, se necessário.
   * @param id - O ID que pode ser string ou number.
   * @returns O ID convertido para número.
   */
  private converterId(id: string | number): number {
    return typeof id === 'string' ? Number(id) : id;
  }
  /**
   * Cria uma nova turma com os dados fornecidos.
   *
   * @param dadosTurma - Dados da turma a ser criada. Pode ser um objeto parcial da entidade `Turma`.
   * @returns A turma criada.
   */
  async criar(dadosTurma: Partial<Turma>): Promise<Turma> {
    const novaTurma = this.repository.create(dadosTurma);
    return await this.repository.save(novaTurma);
  }
  /**
   * Lista todas as turmas cadastradas.
   *
   * @returns Uma promessa que resolve para um array de turmas.
   */
  async listar(): Promise<Turma[]> {
    return await this.repository.find();
  }

  /**
   * Atualiza uma turma existente.
   *
   * @param id - O ID da turma a ser atualizada.
   * @param dadosTurma - Dados atualizados da turma. Pode ser um objeto parcial da entidade `Turma`.
   * @returns A turma atualizada ou null se não encontrada.
   */
  async editar(id: number | string, dadosTurma: Partial<Turma>) {
    const turmaId = this.converterId(id);
    const turmaExistente = await this.repository.findOneBy({ id: turmaId });
    Object.assign(turmaExistente, dadosTurma);
    return await this.repository.save(turmaExistente);
  }

  /**
   * Deleta uma turma pelo ID.
   *
   * @param id - O ID da turma a ser deletada (pode ser string ou number).
   * @returns Uma promessa que resolve para o resultado da operação de exclusão
   */
  async deletar(id: string) {
    const turmaId = this.converterId(id);
    return await this.repository.delete(turmaId);
  }

  /**
   * Busca uma turma específica pelo ID.
   *
   * @param id - O ID da turma a ser buscada (pode ser string ou number).
   * @returns A turma encontrada ou null se não encontrada.
   */
  async buscarPorId(id: string): Promise<Turma | null> {
    const turmaId = this.converterId(id);
    return await this.repository.findOneBy({ id: turmaId });
  }
}
