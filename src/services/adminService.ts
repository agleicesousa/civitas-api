import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { prisma } from '../prisma';
import { ErrorHandler } from '../utils/errorHandler';

interface NovoAdminData {
  email: string;
  senha: string;
  nomeCompleto: string;
  tipoConta: string;
}

export class AdminService {
  /**
   * Lista todos os administradores cadastrados.
   */
  async listarAdmins() {
    return prisma.membros.findMany({
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
   */
  async obterAdminPorId(id: number) {
    const admin = await prisma.membros.findUnique({
      where: { id },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        tipoConta: true
      }
    });

    if (!admin || admin.tipoConta !== 'ADMIN') {
      throw new ErrorHandler(404, 'Administrador não encontrado.');
    }

    return admin;
  }

  /**
   * Cria um novo administrador.
   * @param dados Dados do novo administrador.
   */
  async criarAdmin(dados: NovoAdminData) {
    const { email, senha, nomeCompleto, tipoConta } = dados;

    const emailExistente = await prisma.membros.findUnique({
      where: { email }
    });

    if (emailExistente) {
      throw new ErrorHandler(400, 'E-mail já está em uso.');
    }

    const senhaCriptografada = await hash(senha, 10);

    const novoAdmin = await prisma.membros.create({
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
   * @param dados Dados para atualização.
   */
  async atualizarAdmin(id: number, dados: Partial<NovoAdminData>) {
    const adminExistente = await prisma.membros.findUnique({
      where: { id }
    });

    if (!adminExistente || adminExistente.tipoConta !== 'ADMIN') {
      throw new ErrorHandler(404, 'Administrador não encontrado.');
    }

    if (dados.email) {
      const emailEmUso = await prisma.membros.findUnique({
        where: { email: dados.email }
      });

      if (emailEmUso && emailEmUso.id !== id) {
        throw new ErrorHandler(400, 'E-mail já está em uso.');
      }
    }

    if (dados.senha) {
      dados.senha = await hash(dados.senha, 10);
    }

    const adminAtualizado = await prisma.membros.update({
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
   */
  async deletaAdmin(id: number) {
    const adminExistente = await prisma.membros.findUnique({
      where: { id }
    });

    if (!adminExistente || adminExistente.tipoConta !== 'ADMIN') {
      throw new ErrorHandler(404, 'Administrador não encontrado.');
    }

    await prisma.membros.delete({
      where: { id }
    });
  }

  /**
   * Realiza o login de um administrador.
   * @param email E-mail do administrador.
   * @param senha Senha do administrador.
   */
  async login(email: string, senha: string) {
    const admin = await prisma.membros.findUnique({
      where: { email }
    });

    if (!admin || admin.tipoConta !== 'ADMIN') {
      throw new ErrorHandler(401, 'Seu e-mail ou senha estão incorretos.');
    }

    const senhaValida = await compare(senha, admin.senha);

    if (!senhaValida) {
      throw new ErrorHandler(401, 'Seu e-mail ou senha estão incorretos.');
    }

    const token = sign(
      { id: admin.id, email: admin.email, tipoConta: admin.tipoConta },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );

    return { token };
  }
}
