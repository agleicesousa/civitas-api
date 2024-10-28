import { MysqlDataSource } from '../config/database';
import { Admin } from '../entities/adminEntities';
import { Membros } from '../entities/membrosEntities';
import { criptografarSenha, compararSenha } from '../utils/senhaUtils';
import { gerarToken } from '../utils/jwtUtils';

export class AdminService {
  private adminRepository = MysqlDataSource.getRepository(Admin);
  private membrosRepository = MysqlDataSource.getRepository(Membros);

  /**
   * Lista todos os administradores, incluindo o membro associado.
   * @returns Uma lista de todos os administradores com seus respectivos membros.
   */
  async listarAdmins() {
    return await this.adminRepository.find({ relations: ['membro'] });
  }

  /**
   * Busca um administrador pelo ID.
   * @param id - ID do administrador.
   * @returns O administrador encontrado ou `undefined` se não encontrado.
   */
  async buscarAdminPorId(id: number) {
    return await this.adminRepository.findOne({
      where: { id },
      relations: ['membro']
    });
  }

  /**
   * Cria um novo administrador.
   * @param apelido - Apelido do administrador.
   * @param email - Email do administrador.
   * @param senha - Senha do administrador.
   * @param membroId - ID do membro associado.
   * @returns O novo administrador criado.
   * @throws {Error} Se o membro associado não for encontrado ou se o email for inválido.
   */
  async criarAdmin(
    apelido: string,
    email: string,
    senha: string,
    membroId: number
  ) {
    const membro = await this.membrosRepository.findOneBy({ id: membroId });
    if (!membro) {
      throw new Error('Membro não encontrado.');
    }

    const senhaCriptografada = await criptografarSenha(senha);

    const novoAdmin = this.adminRepository.create({
      apelido,
      email,
      senha: senhaCriptografada,
      membro
    });

    return await this.adminRepository.save(novoAdmin);
  }

  /**
   * Atualiza um administrador existente.
   * @param id - ID do administrador.
   * @param apelido - Novo apelido.
   * @param email - Novo email.
   * @param senha - Nova senha (opcional).
   * @param membroId - ID do membro associado.
   * @returns O administrador atualizado ou `null` se não for encontrado.
   * @throws {Error} Se o membro associado não for encontrado ou se o email for inválido.
   */
  async atualizarAdmin(
    id: number,
    apelido: string,
    email: string,
    senha: string | null,
    membroId: number
  ) {
    const membro = await this.membrosRepository.findOneBy({ id: membroId });
    if (!membro) {
      throw new Error('Membro não encontrado.');
    }

    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      return null;
    }

    admin.apelido = apelido;
    admin.email = email;
    if (senha) {
      admin.senha = await criptografarSenha(senha);
    }
    admin.membro = membro;

    return await this.adminRepository.save(admin);
  }

  /**
   * Deleta um administrador.
   * @param id - ID do administrador a ser deletado.
   * @returns O resultado da operação de exclusão.
   */
  async deletarAdmin(id: number) {
    return await this.adminRepository.delete(id);
  }

  /**
   * Realiza o login de um administrador e retorna um token JWT.
   * @param email - Email do administrador.
   * @param senha - Senha do administrador.
   * @returns Um objeto contendo o token JWT gerado.
   * @throws {Error} Se o administrador não for encontrado ou a senha for inválida.
   */
  async login(email: string, senha: string) {
    const admin = await this.adminRepository.findOne({
      where: { email },
      relations: ['membro']
    });

    if (!admin?.membro) {
      throw new Error('Administrador não encontrado.');
    }

    const senhaValida = await compararSenha(senha, admin.senha);
    if (!senhaValida) {
      throw new Error('Senha inválida.');
    }

    // Gera o token JWT usando o utilitário de token
    const token = gerarToken({
      id: admin.id,
      email: admin.email,
      tipoConta: admin.membro.tipoConta
    });

    return { token };
  }
}
