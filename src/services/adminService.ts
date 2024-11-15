import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { Admin } from '../entities/adminEntities';
import { compararSenha } from '../utils/senhaUtils';
import { gerarToken } from '../utils/jwtUtils';

/**
 * Serviço para gerenciar as operações de login e autenticação de administradores.
 */
export class AdminService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private adminRepository = MysqlDataSource.getRepository(Admin);
  /**
   * Realiza a criação de um novo administrador, associando um membro e criando o administrador.
   * @param membroData - Dados do membro a ser criado.
   * @returns O administrador recém-criado.
   */
  async criarAdmin(membroData: {
    email: string;
    senha: string;
    nomeCompleto: string;
    tipoConta: string;
  }) {
    if (membroData.tipoConta !== 'admin') {
      throw new Error('Tipo de conta inválido. Apenas "admin" é permitido.');
    }

    const membro = this.membrosRepository.create({
      ...membroData,
    });

    membro.senha = await compararSenha(membroData.senha, membro.senha);

    await this.membrosRepository.save(membro);

    const admin = this.adminRepository.create({
      membro,
    });

    await this.adminRepository.save(admin);

    return admin;
  }

  /**
   * Obtém todos os administradores com seus membros associados.
   * @returns Lista de administradores.
   */
  async listarAdmins() {
    const admins = await this.adminRepository.find({
      relations: ['membro'],  // Inclui a entidade Membro relacionada
    });

    return admins;
  }

  /**
   * Obtém um administrador específico pelo seu ID.
   * @param id - ID do administrador.
   * @returns O administrador encontrado.
   * @throws {Error} Se o administrador não for encontrado.
   */
  async buscarAdminPorId(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['membro'],
    });

    if (!admin) {
      throw new Error('Administrador não encontrado.');
    }

    return admin;
  }

  /**
   * Atualiza os dados de um administrador.
   * @param id - ID do administrador a ser atualizado.
   * @param novoMembroData - Dados atualizados do membro.
   * @returns O administrador atualizado.
   * @throws {Error} Se o administrador não for encontrado.
   */
  async atualizarAdmin(id: number, novoMembroData: {
    email?: string;
    senha?: string;
    nomeCompleto?: string;
    tipoConta?: string;
  }) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['membro'],
    });

    if (!admin) {
      throw new Error('Administrador não encontrado.');
    }

    // Atualiza os dados do membro
    const membro = admin.membro;
    Object.assign(membro, novoMembroData);

    if (novoMembroData.senha) {
      membro.senha = await compararSenha(novoMembroData.senha, membro.senha);
    }

    await this.membrosRepository.save(membro);

    return await this.adminRepository.save(admin); // Atualiza o admin
  }

  /**
   * Remove um administrador e o membro associado.
   * @param id - ID do administrador a ser removido.
   * @throws {Error} Se o administrador não for encontrado.
   */
  async deletarAdmin(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['membro'],
    });

    if (!admin) {
      throw new Error('Administrador não encontrado.');
    }
    await this.adminRepository.remove(admin);
    await this.membrosRepository.remove(admin.membro);
  }


/**
 * Realiza o login de um administrador e retorna um token JWT.
 * @param email - Email do administrador.
 * @param senha - Senha do administrador.
 * @returns Um objeto contendo o token JWT gerado.
 * @throws {Error} Se o administrador não for encontrado ou a senha for inválida.
 */
async login(email: string, senha: string) {
  const membro = await this.membrosRepository.findOne({
    where: { email },
    relations: ['admin'],  // Carregar o relacionamento com 'Admin'
  });

  if (!membro || membro.tipoConta !== 'admin') {
    throw new Error('Administrador não encontrado.');
  }

  const senhaValida = await compararSenha(senha, membro.senha);
  if (!senhaValida) {
    throw new Error('Senha inválida.');
  }

  const token = gerarToken({
    id: membro.id,
    tipoConta: membro.tipoConta
  });
    return { token };
  }
}