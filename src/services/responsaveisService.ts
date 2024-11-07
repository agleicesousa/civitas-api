import { MysqlDataSource } from '../config/database';
import { Responsaveis } from '../entities/responsaveisEntities';

export class ResponsaveisService {
  /**
   * Inicializa o banco de dados, se ainda não estiver inicializado.
   * @private
   */
  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

  /**
   * Cria um novo responsável no banco de dados.
   * @param responsavelData - Dados do responsável a ser criado.
   * @returns O responsável recém-criado.
   */
  async criarResponsavel(responsavelData: Partial<Responsaveis>) {
    await this.iniciarDatabase();
    const responsavelRepository = MysqlDataSource.getRepository(Responsaveis);
    const novoResponsavel = responsavelRepository.create(responsavelData);
    return await responsavelRepository.save(novoResponsavel);
  }

  /**
   * Lista todos os responsáveis cadastrados no banco de dados.
   * @returns Uma lista de responsáveis.
   */
  async listarResponsaveis() {
    await this.iniciarDatabase();
    const responsavelRepository = MysqlDataSource.getRepository(Responsaveis);
    return await responsavelRepository.find();
  }

  /**
   * Busca um responsável pelo ID.
   * @param id - ID do responsável a ser buscado.
   * @returns O responsável encontrado ou `null` se não encontrado.
   */
  async buscarResponsavelPorId(id: number) {
    await this.iniciarDatabase();
    const responsavelRepository = MysqlDataSource.getRepository(Responsaveis);
    return await responsavelRepository.findOneBy({ id });
  }

  /**
   * Busca um responsável pelo CPF.
   * @param cpf - CPF do responsável a ser buscado.
   * @returns O responsável encontrado ou `null` se não encontrado.
   */
  async buscarResponsavelPorCpf(cpf: string) {
    await this.iniciarDatabase();
    const responsavelRepository = MysqlDataSource.getRepository(Responsaveis);

    // Realizando a busca exata pelo CPF na entidade `Membros` dentro de `Responsaveis`
    return await responsavelRepository.findOne({
      where: { membro: { cpf: cpf } }
    });
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
