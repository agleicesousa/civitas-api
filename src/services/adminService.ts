import { MysqlDataSource } from '../config/database';
import { Admin } from '../entities/adminEntities';
import { Membros } from '../entities/membrosEntities';
import { TipoConta } from '../entities/baseEntity';
import ErrorHandler from '../errors/errorHandler';
import { criptografarSenha, validarSenha } from '../utils/senhaUtils';

export class AdminService {
  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

  async verificarEmailDuplicado(email: string) {
    await this.iniciarDatabase();
    const membrosRepository = MysqlDataSource.getRepository(Membros);

    const emailExistente = await membrosRepository.findOne({
      where: { email }
    });

    if (emailExistente) {
      throw ErrorHandler.badRequest('Email já cadastrado.');
    }
  }

  async criarAdmin(
    dadosAdmin: {
      email: string;
      senha: string;
      nomeCompleto: string;
      numeroMatricula: string;
      tipoConta: TipoConta;
    },
    adminCriadorId: number | null
  ) {
    await this.iniciarDatabase();

    const adminRepository = MysqlDataSource.getRepository(Admin);
    const membrosRepository = MysqlDataSource.getRepository(Membros);

    await this.verificarEmailDuplicado(dadosAdmin.email);

    if (!validarSenha(dadosAdmin.senha)) {
      throw ErrorHandler.badRequest(
        'Senha inválida. Deve ter ao menos 8 caracteres, uma letra maiúscula e um caractere especial.'
      );
    }

    const senhaCriptografada = await criptografarSenha(dadosAdmin.senha);

    const membro = membrosRepository.create({
      email: dadosAdmin.email,
      senha: senhaCriptografada,
      nomeCompleto: dadosAdmin.nomeCompleto,
      numeroMatricula: dadosAdmin.numeroMatricula,
      tipoConta: TipoConta.ADMIN,
      adminCriadorId: adminCriadorId ? { id: adminCriadorId } : null
    });

    await membrosRepository.save(membro);

    const admin = adminRepository.create({ membro });
    const novoAdmin = await adminRepository.save(admin);

    membro.admin = novoAdmin;
    await membrosRepository.save(membro);

    return novoAdmin;
  }

  async listarAdmins() {
    await this.iniciarDatabase();
    const adminRepository = MysqlDataSource.getRepository(Admin);

    return await adminRepository.find({
      relations: ['membro']
    });
  }

  async buscarAdminPorId(id: number) {
    await this.iniciarDatabase();
    const adminRepository = MysqlDataSource.getRepository(Admin);

    const admin = await adminRepository.findOne({
      where: { id },
      relations: ['membro']
    });

    if (!admin) {
      throw ErrorHandler.notFound('Admin não encontrado.');
    }

    return admin;
  }

  async atualizarAdmin(
    id: number,
    dadosAdmin: Partial<{
      email?: string;
      senha?: string;
      nomeCompleto?: string;
      numeroMatricula?: string;
    }>
  ) {
    await this.iniciarDatabase();
    const adminRepository = MysqlDataSource.getRepository(Admin);
    const membrosRepository = MysqlDataSource.getRepository(Membros);

    const adminExistente = await adminRepository.findOne({
      where: { id },
      relations: ['membro']
    });

    if (!adminExistente) {
      throw ErrorHandler.notFound('Admin não encontrado.');
    }

    const membro = adminExistente.membro;

    if (dadosAdmin.email && dadosAdmin.email !== membro.email) {
      await this.verificarEmailDuplicado(dadosAdmin.email);
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
    await membrosRepository.save(membro);

    return await adminRepository.findOne({
      where: { id },
      relations: ['membro']
    });
  }

  async deletarAdmin(id: number) {
    await this.iniciarDatabase();
    const adminRepository = MysqlDataSource.getRepository(Admin);
    const membrosRepository = MysqlDataSource.getRepository(Membros);

    const adminExistente = await adminRepository.findOne({
      where: { id },
      relations: ['membro']
    });

    if (!adminExistente) {
      throw ErrorHandler.notFound('Admin não encontrado.');
    }

    await membrosRepository.update({ admin: adminExistente }, { admin: null });
    await adminRepository.remove(adminExistente);
  }
}
