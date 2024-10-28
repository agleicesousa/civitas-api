import { MysqlDataSource } from '../config/database';
import { Responsaveis } from '../entities/responsaveisEntities';

export class ResponsaveisService {
  /**
   * Lista todos os responsáveis cadastrados no banco de dados.
   * @returns {Promise<Responsaveis[]>} Uma promessa que resolve em uma lista de responsáveis.
   */
  async listarResponsaveis() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }

    const responsaveisRepository = MysqlDataSource.getRepository(Responsaveis);
    return await responsaveisRepository.find();
  }

  /**
   * Busca um responsável específico pelo seu ID.
   * @param {string} id - O ID do responsável a ser buscado.
   * @returns {Promise<Responsaveis | null>} Uma promessa que resolve no responsável encontrado ou `null` se não existir.
   */
  async buscarResponsavelPorId(id: string) {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }

    const responsaveisRepository = MysqlDataSource.getRepository(Responsaveis);
    return await responsaveisRepository.findOneBy({ id: Number(id) });
  }

  /**
   * Cria um novo responsável no banco de dados.
   * @param {Partial<Responsaveis>} dadosResponsavel - Um objeto parcial contendo os dados do novo responsável.
   * @returns {Promise<Responsaveis>} Uma promessa que resolve no responsável recém-criado.
   */
  async criarResponsavel(dadosResponsavel: Partial<Responsaveis>) {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }

    const responsaveisRepository = MysqlDataSource.getRepository(Responsaveis);
    const novoResponsavel = responsaveisRepository.create(dadosResponsavel);
    return await responsaveisRepository.save(novoResponsavel);
  }

  /**
   * Atualiza um responsável existente no banco de dados.
   * @param {string} id - O ID do responsável a ser atualizado.
   * @param {Partial<Responsaveis>} dadosResponsavel - Um objeto parcial contendo os dados a serem atualizados.
   * @returns {Promise<Responsaveis | null>} Uma promessa que resolve no responsável atualizado ou `null` se o responsável não for encontrado.
   */
  async atualizarResponsavel(
    id: string,
    dadosResponsavel: Partial<Responsaveis>
  ) {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }

    const responsaveisRepository = MysqlDataSource.getRepository(Responsaveis);
    await responsaveisRepository.update(id, dadosResponsavel);
    return await responsaveisRepository.findOneBy({ id: Number(id) });
  }

  /**
   * Deleta um responsável existente no banco de dados.
   * @param {string} id - O ID do responsável a ser deletado.
   * @returns {Promise<void>} Uma promessa que resolve após a conclusão da operação de exclusão.
   */
  async deletarResponsavel(id: string) {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }

    const responsaveisRepository = MysqlDataSource.getRepository(Responsaveis);
    return await responsaveisRepository.delete(Number(id));
  }
}
