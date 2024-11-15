import { MysqlDataSource } from '../config/database';
import { Admin } from '../entities/adminEntities';
import { Membros } from '../entities/membrosEntities';
import { compararSenha } from '../utils/senhaUtils';
import { gerarToken } from '../utils/jwtUtils';

export class AdminService {
  private adminRepository = MysqlDataSource.getRepository(Admin);
  private membrosRepository = MysqlDataSource.getRepository(Membros);

  async listarAdmins() {
    return await this.adminRepository.find({ relations: ['membro'] });
  }

  async buscarAdminPorId(id: number) {
    return await this.adminRepository.findOne({
      where: { id },
      relations: ['membro']
    });
  }

  async criarAdmin(membroId: number) {
    const membro = await this.membrosRepository.findOneBy({ id: membroId });
    if (!membro) {
      throw new Error('Membro não encontrado.');
    }

    const novoAdmin = this.adminRepository.create({ membro });
    return await this.adminRepository.save(novoAdmin);
  }

  async atualizarAdmin(id: number, membroId: number) {
    const membro = await this.membrosRepository.findOneBy({ id: membroId });
    if (!membro) {
      throw new Error('Membro não encontrado.');
    }

    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      return null;
    }

    admin.membro = membro;
    return await this.adminRepository.save(admin);
  }

  async deletarAdmin(id: number) {
    return await this.adminRepository.delete(id);
  }

  async login(email: string, senha: string) {
    const membro = await this.membrosRepository.findOne({
      where: { email },
      relations: ['admin']
    });

    if (!membro?.admin) {
      throw new Error('Administrador não encontrado.');
    }

    const senhaValida = await compararSenha(senha, membro.senha);
    if (!senhaValida) {
      throw new Error('Senha inválida.');
    }

    const token = gerarToken({
      id: membro.admin.id,
      numeroMatricula: membro.numeroMatricula,
      tipoConta: membro.tipoConta
    });

    return { token };
  }
}
