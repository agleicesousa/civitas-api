import { In } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { Alunos } from '../entities/alunosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
import { criptografarSenha } from '../utils/senhaUtils';
import ErrorHandler from '../errors/errorHandler';

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

    //  Buscar turmas
    const turma = await this.turmaRepository.find({
      where: { id: In(dadosAluno.turma) }
    });

    if (!turma.length) {
      throw ErrorHandler.notFound('Turma não encontrada');
    }

    //  Criar membro
    const membro = this.membrosRepository.create({
      email: dadosAluno.email,
      nomeCompleto: dadosAluno.nomeCompleto,
      nuneroMatricula: dadosAluno.numeroMatricula,
      turma: dadosAluno.turma,
      cpf: dadosAluno.cpf,
      senha: dadosAluno.numeroMatricula,
      tipoConta: TipoConta.ALUNO,
      adminCriadorId: adminCriadorId ? { id: adminCriadorId } : null
    });

    await this.membrosRepository.save(membro);

    //  Cria aluno e associa ao membro
    const aluno = this.alunoRepository.crete({
      membro,
      turma
    });

    const novoAluno = this.alunoRepository.save(aluno);

    return novoAluno;
  }
}
