import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import ErrorHandler from '../errors/errorHandler';
import { TipoConta } from '../entities/baseEntity';

interface NovoAdminData {
  email: string;
  senha: string;
  nomeCompleto: string;
  tipoConta: TipoConta;
}

export class AdminService {
  private membroRepository: Repository<Membros>;

  constructor() {
    this.membroRepository = MysqlDataSource.getRepository(Membros);
  }

  /**
   * Lista todos os administradores cadastrados.
   * @returns Lista de administradores.
   */
  async listarAdmins() {
    return this.membroRepository.find({
      where: { tipoConta: TipoConta.ADMIN },
      select: ['id', 'nomeCompleto', 'email', 'tipoConta']
    });
  }

  /**
   * Obtém um administrador pelo ID.
   * @param id ID do administrador.
   * @returns Administrador encontrado.
   * @throws Error se não encontrar o administrador ou se não for um admin.
   */
  async obterAdminPorId(id: number) {
    const admin = await this.membroRepository.findOne({
      where: { id, tipoConta: TipoConta.ADMIN },
      select: ['id', 'nomeCompleto', 'email', 'tipoConta']
    });

    if (!admin) {
      throw ErrorHandler.notFound('Administrador não encontrado.');
    }

    return admin;
  }

  /**
   * Cria um novo administrador.
   * @param dados Dados do novo administrador.
   * @returns Dados do administrador criado.
   * @throws Error se o e-mail já estiver em uso.
   */
  async criarAdmin(dados: NovoAdminData) {
    const { email, senha, nomeCompleto, tipoConta } = dados;

    const emailExistente = await this.membroRepository.findOne({
      where: { email }
    });

    if (emailExistente) {
      throw ErrorHandler.badRequest('E-mail já está em uso.');
    }

    const senhaCriptografada = await hash(senha, 10);

    const novoAdmin = this.membroRepository.create({
      email,
      senha: senhaCriptografada,
      nomeCompleto,
      tipoConta
    });

    await this.membroRepository.save(novoAdmin);

    return {
      id: novoAdmin.id,
      nomeCompleto: novoAdmin.nomeCompleto,
      email: novoAdmin.email,
      tipoConta: novoAdmin.tipoConta
    };
  }

  /**
   * Atualiza os dados de um administrador.
   * @param id ID do administrador a ser atualizado.
   * @param dados Dados a serem atualizados.
   * @returns Dados do administrador atualizado.
   * @throws Error se o administrador não for encontrado ou o e-mail já estiver em uso.
   */
  async atualizarAdmin(id: number, dados: Partial<NovoAdminData>) {
    const adminExistente = await this.membroRepository.findOne({
      where: { id, tipoConta: TipoConta.ADMIN }
    });

    if (!adminExistente) {
      throw ErrorHandler.notFound('Administrador não encontrado.');
    }

    if (dados.email) {
      const emailEmUso = await this.membroRepository.findOne({
        where: { email: dados.email }
      });

      if (emailEmUso && emailEmUso.id !== id) {
        throw ErrorHandler.badRequest('E-mail já está em uso.');
      }
    }

    if (dados.senha) {
      dados.senha = await hash(dados.senha, 10);
    }

    await this.membroRepository.update(id, dados);

    const adminAtualizado = await this.membroRepository.findOne({
      where: { id },
      select: ['id', 'nomeCompleto', 'email', 'tipoConta']
    });

    return adminAtualizado;
  }

  /**
   * Deleta um administrador pelo ID.
   * @param id ID do administrador a ser deletado.
   * @throws Error se o administrador não for encontrado.
   */
  async deletaAdmin(id: number) {
    const adminExistente = await this.membroRepository.findOne({
      where: { id, tipoConta: TipoConta.ADMIN }
    });

    if (!adminExistente) {
      throw ErrorHandler.notFound('Administrador não encontrado.');
    }

    await this.membroRepository.delete(id);
  }
}
