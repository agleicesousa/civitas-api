import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import ErrorHandler from '../errors/errorHandler';

interface NovoAdminData {
  email: string;
  senha: string;
  nomeCompleto: string;
  tipoConta: string;
}

export class AdminService {
  /**
   * Lista todos os administradores cadastrados.
   * @returns Lista de administradores.
   */
  async listarAdmins() {
    return PrismaClient.membros.findMany({
      where: { tipoConta: 'ADMIN' },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        tipoConta: true
      }
    });
  }

  /**
   * Obtém um administrador pelo ID.
   * @param id ID do administrador.
   * @returns Administrador encontrado.
   * @throws Error se não encontrar o administrador ou se não for um admin.
   */
  async obterAdminPorId(id: number) {
    const admin = await PrismaClient.membros.findUnique({
      where: { id },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        tipoConta: true
      }
    });

    if (!admin || admin.tipoConta !== 'ADMIN') {
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

    const emailExistente = await PrismaClient.membros.findUnique({
      where: { email }
    });

    if (emailExistente) {
      throw ErrorHandler.badRequest('E-mail já está em uso.');
    }

    const senhaCriptografada = await hash(senha, 10);

    const novoAdmin = await PrismaClient.membros.create({
      data: {
        email,
        senha: senhaCriptografada,
        nomeCompleto,
        tipoConta
      }
    });

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
    const adminExistente = await PrismaClient.membros.findUnique({
      where: { id }
    });

    if (!adminExistente || adminExistente.tipoConta !== 'ADMIN') {
      throw ErrorHandler.notFound('Administrador não encontrado.');
    }

    if (dados.email) {
      const emailEmUso = await PrismaClient.membros.findUnique({
        where: { email: dados.email }
      });

      if (emailEmUso && emailEmUso.id !== id) {
        throw ErrorHandler.badRequest('E-mail já está em uso.');
      }
    }

    if (dados.senha) {
      dados.senha = await hash(dados.senha, 10);
    }

    const adminAtualizado = await PrismaClient.membros.update({
      where: { id },
      data: dados
    });

    return {
      id: adminAtualizado.id,
      nomeCompleto: adminAtualizado.nomeCompleto,
      email: adminAtualizado.email,
      tipoConta: adminAtualizado.tipoConta
    };
  }

  /**
   * Deleta um administrador pelo ID.
   * @param id ID do administrador a ser deletado.
   * @throws Error se o administrador não for encontrado.
   */
  async deletaAdmin(id: number) {
    const adminExistente = await PrismaClient.membros.findUnique({
      where: { id }
    });

    if (!adminExistente || adminExistente.tipoConta !== 'ADMIN') {
      throw ErrorHandler.notFound('Administrador não encontrado.');
    }

    await PrismaClient.membros.delete({
      where: { id }
    });
  }

  /**
   * Realiza o login de um administrador.
   * @param email E-mail do administrador.
   * @param senha Senha do administrador.
   * @returns Token JWT para o administrador.
   * @throws Error se o e-mail ou senha estiverem incorretos.
   */
  async login(email: string, senha: string) {
    const admin = await PrismaClient.membros.findUnique({
      where: { email }
    });

    if (!admin || admin.tipoConta !== 'ADMIN') {
      throw ErrorHandler.unauthorized('Seu e-mail ou senha estão incorretos.');
    }

    const senhaValida = await compare(senha, admin.senha);

    if (!senhaValida) {
      throw ErrorHandler.unauthorized('Seu e-mail ou senha estão incorretos.');
    }

    const token = sign(
      { id: admin.id, email: admin.email, tipoConta: admin.tipoConta },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );

    return { token };
  }
}
