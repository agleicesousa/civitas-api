import { MysqlDataSource } from '../config/database';
import { Admin } from '../entities/adminEntities';
import { Membros } from '../entities/membrosEntities';
import { TipoConta } from '../entities/baseEntity';
import ErrorHandler from '../errors/errorHandler';
import { criptografarSenha, validarSenha } from '../utils/validarSenhaUtils';

/**
 * Serviço responsável por gerenciar as operações de Admin no sistema.
 * Inclui operações para criar, listar, buscar, atualizar e deletar Admins.
 */
export class AdminService {
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
   * Cria um novo administrador no sistema.
   * Valida senha, criptografa antes de armazenar no banco.
   *
   * @param dadosAdmin - Dados do novo administrador.
   * @param adminCriadorId - ID do administrador que está criando o novo admin.
   * @returns O novo Admin criado no sistema.
   */
  async criarAdmin(
    dadosAdmin: {
      email: string;
      senha: string;
      nomeCompleto: string;
      tipoConta: TipoConta;
    },
    adminCriadorId: number
  ) {
    await this.iniciarDatabase();

    if (!validarSenha(dadosAdmin.senha)) {
      throw ErrorHandler.badRequest(
        'Senha inválida. Deve ter ao menos 8 caracteres, uma letra maiúscula e um caractere especial.'
      );
    }

    const senhaCriptografada = await criptografarSenha(dadosAdmin.senha);

    const membro = this.membrosRepository.create({
      email: dadosAdmin.email,
      senha: senhaCriptografada,
      nomeCompleto: dadosAdmin.nomeCompleto,
      tipoConta: TipoConta.ADMIN,
      adminCriadorId
    });

    await this.membrosRepository.save(membro);

    const admin = this.adminRepository.create({ membro });
    const novoAdmin = await this.adminRepository.save(admin);

    membro.adminCriador = novoAdmin;

    return novoAdmin;
  }

  /**
   * Lista todos os administradores criados por um administrador autenticado.
   *
   * @param adminLogadoId - ID do administrador autenticado.
   * @returns Lista de administradores associados ao administrador autenticado.
   */
  async listarAdmins(adminLogadoId: number) {
    await this.iniciarDatabase();

    return await this.adminRepository.find({
      where: {
        membro: {
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro']
    });
  }

  /**
   * Busca um administrador específico pelo ID.
   * Verifica se o administrador logado tem permissão para acessar os dados.
   *
   * @param id - ID do administrador a ser buscado.
   * @param adminLogadoId - ID do administrador logado.
   * @returns Detalhes do administrador encontrado.
   */
  async buscarAdminPorId(id: number, adminLogadoId: number) {
    await this.iniciarDatabase();

    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['membro']
    });

    if (!admin) {
      throw ErrorHandler.notFound('Admin não encontrado.');
    }

    if (admin.membro.adminCriadorId !== adminLogadoId) {
      throw ErrorHandler.badRequest(
        'Você não pode acessar um admin que não foi criado por você.'
      );
    }

    return admin;
  }

  /**
   * Atualiza as informações de um administrador.
   * Verifica permissão do administrador autenticado.
   * Valida e criptografa senha, caso ela seja alterada.
   *
   * @param id - ID do administrador a ser atualizado.
   * @param dadosAdmin - Dados que devem ser atualizados.
   * @param adminLogadoId - ID do administrador autenticado.
   * @returns O administrador atualizado.
   */
  async atualizarAdmin(
    id: number,
    dadosAdmin: Partial<{
      email?: string;
      senha?: string;
      nomeCompleto?: string;
      numeroMatricula?: string;
    }>,
    adminLogadoId: number
  ) {
    await this.iniciarDatabase();

    const adminExistente = await this.adminRepository.findOne({
      where: { id },
      relations: ['membro']
    });

    if (!adminExistente) {
      throw ErrorHandler.notFound('Admin não encontrado.');
    }

    const membro = adminExistente.membro;

    if (membro.adminCriadorId !== adminLogadoId) {
      throw ErrorHandler.badRequest(
        'Você não pode atualizar um admin que não foi criado por você.'
      );
    }

    if (dadosAdmin.senha) {
      if (!validarSenha(dadosAdmin.senha)) {
        throw ErrorHandler.badRequest(
          'Senha inválida. Deve ter ao menos 8 caracteres, uma letra maiúscula e um caractere especial.'
        );
      }
      dadosAdmin.senha = await criptografarSenha(dadosAdmin.senha);
    }

    Object.assign(membro, dadosAdmin);
    await this.membrosRepository.save(membro);

    return await this.adminRepository.findOne({
      where: { id },
      relations: ['membro']
    });
  }

  /**
   * Deleta um administrador no sistema.
   * Verifica se o administrador logado tem permissão para realizar a exclusão.
   *
   * @param id - ID do administrador a ser excluído.
   * @param adminLogadoId - ID do administrador logado.
   * @returns Nada. Realiza a exclusão no banco de dados.
   */
  async deletarAdmin(id: number, adminLogadoId: number) {
    await this.iniciarDatabase();

    const adminExistente = await this.adminRepository.findOne({
      where: { id },
      relations: ['membro']
    });

    if (!adminExistente) {
      throw ErrorHandler.notFound('Admin não encontrado.');
    }

    if (adminExistente.membro.adminCriadorId !== adminLogadoId) {
      throw ErrorHandler.badRequest(
        'Você não pode excluir um admin que não foi criado por você.'
      );
    }

    await this.membrosRepository.remove(adminExistente.membro);
    await this.adminRepository.remove(adminExistente);
  }
}
