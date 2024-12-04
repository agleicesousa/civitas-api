import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { Admin } from '../entities/adminEntities';

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
      throw new Error('Admin Criador não especificado.');
    }

    const adminCriador = await this.adminRepository.findOne({
      where: { id: dadosMembro.adminCriadorId }
    });

    if (!adminCriador) {
      throw new Error('Admin Criador não encontrado.');
    }

    const novoMembro = this.membrosRepository.create({
      ...dadosMembro,
      adminCriadorId: adminCriador.id
    });

    return await this.membrosRepository.save(novoMembro);
  }

  async listarMembros(adminCriadorId: number) {
    await this.iniciarDatabase();

    if (!adminCriadorId) {
      throw new Error('ID do administrador não fornecido.');
    }

    return await this.membrosRepository.find({
      where: {
        adminCriadorId: adminCriadorId
      }
    });
  }

  async buscarMembroPorId(adminCriadorId: number, id: string) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      throw new Error('ID inválido');
    }

    const membro = await this.membrosRepository.findOne({
      where: { id: idNumber, adminCriadorId: adminCriadorId }
    });

    if (!membro) {
      throw new Error(
        'Membro não encontrado ou você não tem permissão para acessá-lo.'
      );
    }

    return membro;
  }

  async atualizarMembro(
    adminCriadorId: number,
    id: string,
    dadosMembro: Partial<Membros>
  ) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      throw new Error('ID inválido');
    }

    const membroExistente = await this.membrosRepository.findOne({
      where: { id: idNumber, adminCriadorId: adminCriadorId }
    });

    if (!membroExistente) {
      throw new Error(
        'Membro não encontrado ou você não tem permissão para atualizá-lo.'
      );
    }

    await this.membrosRepository.update(idNumber, dadosMembro);
    return await this.membrosRepository.findOneBy({ id: idNumber });
  }

  async deletarMembro(adminCriadorId: number, id: string) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      throw new Error('ID inválido');
    }

    const membroExistente = await this.membrosRepository.findOne({
      where: { id: idNumber, adminCriadorId: adminCriadorId }
    });

    if (!membroExistente) {
      throw new Error(
        'Membro não encontrado ou você não tem permissão para deletá-lo.'
      );
    }

    return await this.membrosRepository.delete(idNumber);
  }
}
