import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';

export class MembrosService {
  private membroRepository = MysqlDataSource.getRepository(Membros);

  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

  async listarMembros(adminCriadorId: number) {
    await this.iniciarDatabase();
    return await membrosRepository.find({
      where: { admin: { id: adminCriadorId } }
    });
  }

  async buscarMembroPorId(adminCriadorId: number, id: string) {
    await this.iniciarDatabase();
    const idNumber = Number(id);
    return await membrosRepository.findOne({
      where: { id: idNumber, admin: { id: adminCriadorId } }
    });
  }

  async criarMembro(dadosMembro: Partial<Membros>) {
    await this.iniciarDatabase();
    const novoMembro = membrosRepository.create({
      ...dadosMembro
    });
    return await membrosRepository.save(novoMembro);
  }

  async atualizarMembro(
    adminCriadorId: number,
    id: string,
    dadosMembro: Partial<Membros>
  ) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    const membroExistente = await membrosRepository.findOne({
      where: { id: idNumber, admin: { id: adminCriadorId } }
    });

    if (!membroExistente) {
      throw new Error(
        'Membro não encontrado ou você não tem permissão para atualizá-lo.'
      );
    }

    await membrosRepository.update(idNumber, dadosMembro);
    return await membrosRepository.findOneBy({ id: idNumber });
  }

  async deletarMembro(adminCriadorId: number, id: string) {
    await this.iniciarDatabase();
    const idNumber = Number(id);

    const membroExistente = await membrosRepository.findOne({
      where: { id: idNumber, admin: { id: adminCriadorId } }
    });

    if (!membroExistente) {
      throw new Error(
        'Membro não encontrado ou você não tem permissão para deletá-lo.'
      );
    }

    return await membrosRepository.delete(idNumber);
  }
}
