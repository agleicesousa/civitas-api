import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { Admin } from '../entities/adminEntities';
import ErrorHandler from '../errors/errorHandler';

export class MembrosService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private adminRepository = MysqlDataSource.getRepository(Admin);

  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

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

  async listarMembros(adminCriadorId: number) {
    await this.iniciarDatabase();

    if (!adminCriadorId) {
      throw ErrorHandler.badRequest('ID do administrador não fornecido.');
    }

    return await this.membrosRepository.find({
      where: { adminCriadorId }
    });
  }

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
      throw ErrorHandler.notFound('Membro não encontrado ou você não tem permissão para acessá-lo.');
    }

    return membro;
  }

  async atualizarMembro(adminCriadorId: number, id: string, dadosMembro: Partial<Membros>) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      throw ErrorHandler.badRequest('ID inválido.');
    }

    const membroExistente = await this.membrosRepository.findOne({
      where: { id: idNumber, adminCriadorId }
    });

    if (!membroExistente) {
      throw ErrorHandler.notFound('Membro não encontrado ou você não tem permissão para atualizá-lo.');
    }

    await this.membrosRepository.update(idNumber, dadosMembro);
    return await this.membrosRepository.findOneBy({ id: idNumber });
  }

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
      throw ErrorHandler.notFound('Membro não encontrado ou você não tem permissão para deletá-lo.');
    }

    await this.membrosRepository.delete(idNumber);
  }
}
