import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { gerarToken } from '../utils/jwtUtils';
import { ErrorHandler } from '../errors/errorHandler.ts';

export class LoginService {
  private membroRepository: Repository<Membros>;

  constructor() {
    this.membroRepository = MysqlDataSource.getRepository(Membros);
  }

  async login(email: string, senha: string) {
    // Busca o usuário no banco de dados pelo email
    const user = await this.membroRepository.findOne({ where: { email } });

    if (!user) {
      throw ErrorHandler.unauthorized('Seu e-mail ou senha estão incorretos.');
    }

    // Verifica se a senha está correta
    const senhaValida = await compare(senha, user.senha);

    if (!senhaValida) {
      throw ErrorHandler.unauthorized('Seu e-mail ou senha estão incorretos.');
    }

    // Gera o token JWT com o id, email e tipo de conta do usuário
    const token = gerarToken(
      { id: user.id, email: user.email, tipoConta: user.tipoConta },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, tipoConta: user.tipoConta };
  }
}
