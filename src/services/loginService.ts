import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { gerarToken } from '../utils/jwtUtils';
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

    return { token, tipoConta: user.tipoConta };
  }
}
