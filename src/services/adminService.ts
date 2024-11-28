import { Repository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import ErrorHandler from '../errors/errorHandler';
import { TipoConta } from '../entities/baseEntity';
import { hash } from 'bcrypt';

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

  async listarAdmins() {
    return this.membroRepository.find({
      where: { tipoConta: TipoConta.ADMIN },
      select: ['id', 'nomeCompleto', 'email', 'tipoConta']
    });
  }

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

  async criarAdmin(dados: NovoAdminData) {
    const { email, senha, nomeCompleto } = dados;

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
      tipoConta: TipoConta.ADMIN
    });

    await this.membroRepository.save(novoAdmin);

    return {
      id: novoAdmin.id,
      nomeCompleto: novoAdmin.nomeCompleto,
      email: novoAdmin.email,
      tipoConta: novoAdmin.tipoConta
    };
  }

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
