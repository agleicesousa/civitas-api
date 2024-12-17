import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { gerarToken, gerarTokenRecuperacao } from '../utils/jwtUtils';
import ErrorHandler from '../errors/errorHandler';

export class LoginService {
  private membroRepository: Repository<Membros>;

  constructor() {
    this.membroRepository = MysqlDataSource.getRepository(Membros);
  }

  async login(email: string, senha: string) {
    const user = await this.membroRepository.findOne({ where: { email } });

    if (!user) {
      throw ErrorHandler.unauthorized('Seu e-mail ou senha estão incorretos.');
    }

    const senhaValida = await compare(senha, user.senha);
    if (!senhaValida) {
      throw ErrorHandler.unauthorized('Seu e-mail ou senha estão incorretos.');
    }

    const token = gerarToken({
      id: user.id,
      email: user.email,
      tipoConta: user.tipoConta
    });

    return {
      token,
      tipoConta: user.tipoConta,
      primeiroLogin: user.primeiroLogin
    };
  }

  async atualizarSenhaPrimeiroLogin(id: number, novaSenha: string) {
    const user = await this.membroRepository.findOne({ where: { id } });

    if (!user) {
      throw ErrorHandler.notFound('Usuário não encontrado.');
    }

    user.senha = novaSenha;
    user.primeiroLogin = false;

    await this.membroRepository.save(user);
    return { message: 'Senha atualizada com sucesso.' };
  }

  async solicitarRecuperacao(email: string) {
    const membro = await this.membroRepository.findOne({ where: { email } });

    if (!membro) {
      throw ErrorHandler.notFound('Usuário com este email não encontrado.');
    }

    const token = gerarTokenRecuperacao();
    membro.resetToken = token;
    membro.resetTokenExp = new Date(Date.now() + 3600000); // Token válido por 1 hora

    await this.membroRepository.save(membro);

    // Simula o envio do e-mail
    console.log(
      `Link para recuperação: https://localhost:4444/resetar-senha?token=${token}`
    );
    return { message: 'Link de recuperação enviado para o email.' };
  }
}
