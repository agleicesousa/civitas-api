import { FindManyOptions, Like } from "typeorm";
import { MysqlDataSource } from "../config/database";
import { Membros } from "../entities/membrosEntities";
import { Alunos } from "../entities/alunosEntities";
import { Turma } from "../entities/turmasEntities";
import { TipoConta } from "../entities/baseEntity";
import ErrorHandler from "../errors/errorHandler";
import { criptografarSenha } from "../utils/senhaUtils";

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

    const turma = await this.turmaRepository.findOneBy({
      id: dadosAluno.turma,
    });
    if (!turma) {
      throw ErrorHandler.notFound("Turma não encontrada");
    }

    const senhaCriptografada = await criptografarSenha(
      dadosAluno.numeroMatricula
    );

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

    const aluno = this.alunoRepository.create({
      membro,
      turma,
    });

    return this.alunoRepository.save(aluno);
  }

  async listarAlunos(
    paginaNumero: number,
    paginaTamanho: number,
    termoDeBusca: string,
    adminId: number
  ) {
    await this.iniciarDatabase();

    const pular = (paginaNumero - 1) * paginaTamanho;

    const opcoesBusca: FindManyOptions<Alunos> = {
      relations: ["membro", "turma"],
      where: {
        admin: { id: adminId },
        ...(termoDeBusca && {
          membro: { nomeCompleto: Like(`%${termoDeBusca}%`) },
        }),
      },
      order: {
        membro: {
          nomeCompleto: "ASC",
        },
      },
    };

    if (paginaTamanho && paginaTamanho > 0) {
      opcoesBusca.skip = pular;
      opcoesBusca.take = paginaTamanho;
    }

    const [alunos, total] = await this.alunoRepository.findAndCount(
      opcoesBusca
    );

    const alunosMap = alunos.map((aluno) => ({
      id: aluno.id,
      nomeCompleto: aluno.membro.nomeCompleto,
      email: aluno.membro.email,
      numeroMatricula: aluno.membro.numeroMatricula,
      turma: aluno.turma?.id ?? null,
    }));

    return {
      data: alunosMap,
      total,
    };
  }
}
