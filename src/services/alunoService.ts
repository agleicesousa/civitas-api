import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { Alunos } from '../entities/alunosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
import ErrorHandler from '../errors/errorHandler';
import { criptografarSenha } from '../utils/senhaUtils';

export class AlunoService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private alunoRepository = MysqlDataSource.getRepository(Alunos);
  private turmaRepository = MysqlDataSource.getRepository(Turma);

  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

  async criarAluno(
    dadosAluno: {
      email: string;
      nomeCompleto: string;
      numeroMatricula: string;
      turma: number;
      cpf: string;
    },
    adminCriadorId: number | null
  ) {
    await this.iniciarDatabase();

    // Buscar a turma pelo ID
    const turma = await this.turmaRepository.findOne({
      where: { id: dadosAluno.turma },
    });

    if (!turma) {
      throw ErrorHandler.notFound('Turma não encontrada');
    }

    // Criar membro
    const senhaCriptografada = await criptografarSenha(dadosAluno.numeroMatricula);
    const membro = this.membrosRepository.create({
      email: dadosAluno.email,
      nomeCompleto: dadosAluno.nomeCompleto,
      numeroMatricula: dadosAluno.numeroMatricula,
      cpf: dadosAluno.cpf,
      senha: senhaCriptografada,
      tipoConta: TipoConta.ALUNO,
      adminCriadorId: adminCriadorId ? { id: adminCriadorId } : null,
    });

    await this.membrosRepository.save(membro);

    // Criar aluno e associar ao membro e à turma
    const aluno = this.alunoRepository.create({
      membro,
      turma,
    });

    const novoAluno = await this.alunoRepository.save(aluno);

    return novoAluno;
  }
}
