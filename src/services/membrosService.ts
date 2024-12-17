import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { Admin } from '../entities/adminEntities';
import ErrorHandler from '../errors/errorHandler';

/**
 * Serviço responsável pela lógica de negócios para manipulação de membros no sistema.
 * Inclui operações CRUD (Create, Read, Update, Delete) relacionadas aos membros e verificações de permissão.
 */
export class MembrosService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private adminRepository = MysqlDataSource.getRepository(Admin);

  /**
   * Inicializa a conexão com o banco de dados caso ainda não esteja inicializada.
   */
  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

  /**
   * Cria um novo membro no banco de dados.
   * Verifica se o ID do administrador criador existe no banco antes de prosseguir.
   *
   * @param dadosMembro - Dados do novo membro a ser criado.
   * @returns O membro criado no banco de dados.
   * @throws Error caso o administrador criador não exista ou falhe ao salvar no banco de dados.
   */
  async criarMembro(dadosMembro: Partial<Membros>) {
    await this.iniciarDatabase();

    if (!dadosMembro.adminCriadorId) {
      throw ErrorHandler.badRequest('Admin Criador não especificado.');
    }

    const adminCriador = await this.adminRepository.findOne({
      where: { id: dadosMembro.adminCriadorId }
    });

    if (!adminCriador) {
      throw ErrorHandler.notFound('Admin Criador não encontrado.');
    }

    const novoMembro = this.membrosRepository.create({
      ...dadosMembro,
      adminCriadorId: adminCriador.id
    });

    try {
      await this.membrosRepository.save(novoMembro);
      return novoMembro;
    } catch (error) {
      throw ErrorHandler.internalServerError('Erro ao salvar novo membro.');
    }
  }

  /**
   * Lista todos os membros criados por um administrador específico.
   *
   * @param adminCriadorId - ID do administrador responsável pelos membros.
   * @returns Lista de membros associados ao administrador.
   * @throws Error caso o ID do administrador não seja fornecido.
   */
  async listarMembros(adminCriadorId: number) {
    await this.iniciarDatabase();

    if (!adminCriadorId) {
      throw ErrorHandler.badRequest('ID do administrador não fornecido.');
    }

    return await this.membrosRepository.find({
      where: { adminCriadorId }
    });
  }

  /**
   * Busca um membro pelo ID específico.
   * Verifica se o membro existe e se o administrador tem permissão para acessá-lo.
   *
   * @param adminCriadorId - ID do administrador que tenta acessar o membro.
   * @param id - ID do membro a ser buscado.
   * @returns O membro encontrado no banco de dados.
   * @throws Error caso o membro não seja encontrado ou caso o ID seja inválido.
   */
  async buscarMembroPorId(adminCriadorId: number, id: string) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      throw ErrorHandler.badRequest('ID inválido.');
    }

    const membro = await this.membrosRepository.findOne({
      where: { id: idNumber, adminCriadorId }
    });

    if (!membro) {
      throw ErrorHandler.notFound(
        'Membro não encontrado ou você não tem permissão para acessá-lo.'
      );
    }

    return membro;
  }

  /**
   * Atualiza as informações de um membro específico.
   * Verifica se o membro existe e se o administrador tem permissão para atualizá-lo.
   *
   * @param adminCriadorId - ID do administrador responsável pela operação.
   * @param id - ID do membro a ser atualizado.
   * @param dadosMembro - Dados que devem ser atualizados.
   * @returns O membro atualizado no banco de dados.
   * @throws Error caso o membro não seja encontrado ou caso o ID seja inválido.
   */
  async atualizarMembro(
    adminCriadorId: number,
    id: string,
    dadosMembro: Partial<Membros>
  ) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      throw ErrorHandler.badRequest('ID inválido.');
    }

    const membroExistente = await this.membrosRepository.findOne({
      where: { id: idNumber, adminCriadorId }
    });

    if (!membroExistente) {
      throw ErrorHandler.notFound(
        'Membro não encontrado ou você não tem permissão para atualizá-lo.'
      );
    }

    await this.membrosRepository.update(idNumber, dadosMembro);
    return await this.membrosRepository.findOneBy({ id: idNumber });
  }

  /**
   * Deleta um membro específico do banco de dados.
   * Verifica se o membro existe e se o administrador tem permissão para deletá-lo.
   *
   * @param adminCriadorId - ID do administrador responsável pela operação.
   * @param id - ID do membro a ser deletado.
   * @throws Error caso o membro não seja encontrado ou caso o ID seja inválido.
   */
  async deletarMembro(adminCriadorId: number, id: string) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      throw ErrorHandler.badRequest('ID inválido.');
    }

    const membroExistente = await this.membrosRepository.findOne({
      where: { id: idNumber, adminCriadorId }
    });

    if (!membroExistente) {
      throw ErrorHandler.notFound(
        'Membro não encontrado ou você não tem permissão para deletá-lo.'
      );
    }

    await this.membrosRepository.delete(idNumber);
  }
}
