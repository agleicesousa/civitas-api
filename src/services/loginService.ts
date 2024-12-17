import { compare } from 'bcrypt';
import { Repository, MoreThan } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { gerarToken, gerarTokenRecuperacao } from '../utils/jwtUtils';
import ErrorHandler from '../errors/errorHandler';
import { criptografarSenha } from '../utils/validarSenhaUtils';

/**
 * Serviço responsável por gerenciar a lógica de autenticação,
 * recuperação de senha e redefinição de senhas de usuários.
 */
export class LoginService {
  private membroRepository: Repository<Membros>;

  constructor() {
    // Configura o repositório do banco de dados com o Entity de membros.
    this.membroRepository = MysqlDataSource.getRepository(Membros);
  }

  /**
   * Realiza o login de um usuário verificando o e-mail e senha.
   * @param email - O e-mail do usuário para autenticação.
   * @param senha - Senha informada pelo usuário no login.
   * @returns Retorna um token JWT, tipoConta e status do primeiro login.
   * @throws ErrorHandler caso falhe na autenticação.
   */
  async login(email: string, senha: string) {
    // Busca usuário pelo e-mail.
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

  /**
   * Atualiza a senha de um usuário no caso de primeiro login.
   * @param id - ID do usuário que está realizando o primeiro login.
   * @param novaSenha - Senha que será configurada no primeiro login.
   * @returns Mensagem de sucesso.
   * @throws ErrorHandler caso usuário não seja encontrado.
   */
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

  /**
   * Solicita a recuperação da senha enviando um token para o e-mail.
   * @param email - Email do usuário que deseja recuperar sua senha.
   * @returns Mensagem confirmando envio do link de recuperação.
   * @throws ErrorHandler caso o usuário não seja encontrado.
   */
  async solicitarRecuperacao(email: string) {
    const membro = await this.membroRepository.findOne({ where: { email } });

    if (!membro) {
      throw ErrorHandler.notFound('Usuário com este email não encontrado.');
    }

    const token = gerarTokenRecuperacao();
    membro.resetToken = token;
    membro.resetTokenExp = new Date(Date.now() + 3600000); // Token válido por 1 hora.

    await this.membroRepository.save(membro);

    // TODO: Simula o envio do e-mail - uso interno.
    console.log(
      `Link para recuperação: https://localhost:4444/resetar-senha?token=${token}`
    );

    return { message: 'Link de recuperação enviado para o email.' };
  }

  /**
   * Redefine a senha utilizando um token válido.
   * @param token - Token para redefinição gerado no processo de recuperação.
   * @param novaSenha - Nova senha definida pelo usuário.
   * @returns Mensagem confirmando a alteração.
   * @throws ErrorHandler caso token inválido ou expirado.
   */
  async resetarSenha(token: string, novaSenha: string) {
    const membro = await this.membroRepository.findOne({
      where: { resetToken: token, resetTokenExp: MoreThan(new Date()) }
    });

    if (!membro) {
      throw ErrorHandler.badRequest('Token inválido ou expirado.');
    }

    if (!novaSenha) {
      throw ErrorHandler.badRequest('A nova senha deve ser informada.');
    }

    membro.senha = await criptografarSenha(novaSenha);
    membro.resetToken = null;
    membro.resetTokenExp = null;

    await this.membroRepository.save(membro);

    return { message: 'Senha alterada com sucesso.' };
  }
}
