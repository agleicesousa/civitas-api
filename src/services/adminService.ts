import { MysqlDataSource } from '../config/database';
import { Admin } from '../entities/adminEntities';
import { Membros } from '../entities/membrosEntities';
import ErrorHandler from '../middlewares/errorHandler';
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

  async criarAdmin(dadosAdmin: Partial<Admin>) {
    await this.iniciarDatabase();
    const adminRepository = MysqlDataSource.getRepository(Admin);
    const membrosRepository = MysqlDataSource.getRepository(Membros);

    if (!validarSenha(dadosAdmin.senha || '')) {
      throw ErrorHandler.badRequest(
        'Senha inválida. Deve ter ao menos 8 caracteres, uma letra maiúscula e um caractere especial.'
      );
    }

    const senhaCriptografada = await criptografarSenha(dadosAdmin.senha || '');

    const membro = membrosRepository.create({
      email: dadosAdmin.email,
      senha: senhaCriptografada,
      nomeCompleto: dadosAdmin.nomeCompleto,
      numeroMatricula: dadosAdmin.numeroMatricula,
      tipoConta: 'admin'
    });

    const admin = adminRepository.create({
      ...dadosAdmin,
      membro
    });

    return await adminRepository.save(admin);
  }

  async listarAdmins() {
    await this.iniciarDatabase();
    const adminRepository = MysqlDataSource.getRepository(Admin);
    return await adminRepository.find();
  }

  async buscarAdminPorId(id: number) {
    await this.iniciarDatabase();
    const adminRepository = MysqlDataSource.getRepository(Admin);

    const admin = await adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw ErrorHandler.notFound('Admin não encontrado.');
    }

    return admin;
  }

  async atualizarAdmin(id: number, dadosAdmin: Partial<Admin>) {
    await this.iniciarDatabase();
    const adminRepository = MysqlDataSource.getRepository(Admin);

    const adminExistente = await adminRepository.findOne({ where: { id } });

    if (!adminExistente) {
      throw ErrorHandler.notFound('Admin não encontrado.');
    }

    if (dadosAdmin.senha) {
      if (!validarSenha(dadosAdmin.senha)) {
        throw ErrorHandler.badRequest(
          'Senha inválida. Deve ter ao menos 8 caracteres, uma letra maiúscula e um caractere especial.'
        );
      }
      dadosAdmin.senha = await criptografarSenha(dadosAdmin.senha);
    }

    await adminRepository.update(id, dadosAdmin);

    return await adminRepository.findOne({ where: { id } });
  }

  async deletarAdmin(id: number) {
    await this.iniciarDatabase();
    const adminRepository = MysqlDataSource.getRepository(Admin);

    const adminExistente = await adminRepository.findOne({ where: { id } });

    if (!adminExistente) {
      throw ErrorHandler.notFound('Admin não encontrado.');
    }

    return await adminRepository.remove(adminExistente);
  }
}
