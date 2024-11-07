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
   * Atualiza as informações de um responsável.
   * @param id - ID do responsável a ser atualizado.
   * @param responsavelData - Dados atualizados do responsável.
   * @returns O responsável atualizado ou `null` se não encontrado.
   */
  async atualizarResponsavel(
    id: number,
    responsavelData: Partial<Responsaveis>
  ) {
    await this.iniciarDatabase();
    const responsavelRepository = MysqlDataSource.getRepository(Responsaveis);
    const responsavel = await responsavelRepository.findOne({ where: { id } });

    if (!responsavel) {
      return null;
    }

    return await responsavelRepository.save({
      ...responsavel,
      ...responsavelData
    });
  }

  /**
   * Exclui um responsável pelo ID.
   * @param id - ID do responsável a ser excluído.
   * @returns `true` se a exclusão for bem-sucedida ou `null` se o responsável não for encontrado.
   */
  async deletarResponsavel(id: number) {
    await this.iniciarDatabase();
    const responsavelRepository = MysqlDataSource.getRepository(Responsaveis);
    const responsavel = await responsavelRepository.findOne({ where: { id } });

    if (!responsavel) {
      return null;
    }

    await responsavelRepository.delete({ id });
    return true;
  }
}
