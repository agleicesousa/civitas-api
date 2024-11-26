import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';

export class MembrosService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);

  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

  async listarMembros(adminCriadorId: number) {
    await this.iniciarDatabase();
    return await this.membrosRepository.find({
      where: { admin: { id: adminCriadorId } }
    });
  }

  async buscarMembroPorId(adminCriadorId: number, id: string) {
    await this.iniciarDatabase();
    const idNumber = Number(id);
    return await this.membrosRepository.findOne({
      where: { id: idNumber, admin: { id: adminCriadorId } }
    });
  }

  async criarMembro(dadosMembro: Partial<Membros>) {
    await this.iniciarDatabase();
    const novoMembro = this.membrosRepository.create({
      ...dadosMembro
    });
    return await this.membrosRepository.save(novoMembro);
  }

  async atualizarMembro(
    adminCriadorId: number,
    id: string,
    dadosMembro: Partial<Membros>
  ) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    const membroExistente = await this.membrosRepository.findOne({
      where: { id: idNumber, admin: { id: adminCriadorId } }
    });

    if (!membroExistente) {
      throw new Error(
        'Membro não encontrado ou você não tem permissão para atualizá-lo.'
      );
    }

    await this.memmbrosRepository.update(idNumber, dadosMembro);
    return await this.membrosRepository.findOneBy({ id: idNumber });
  }

  async deletarMembro(adminCriadorId: number, id: string) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    const membroExistente = await this.membrosRepository.findOne({
      where: { id: idNumber, admin: { id: adminCriadorId } }
    });

    if (!membroExistente) {
      throw new Error(
        'Membro não encontrado ou você não tem permissão para deletá-lo.'
      );
    }

    return await this.membrosRepository.delete(idNumber);
  }
}
