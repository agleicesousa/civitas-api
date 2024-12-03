import { MysqlDataSource } from "../config/database";
import { Membros } from "../entities/membrosEntities";
import { Alunos } from "../entities/alunosEntities";
import { Turma } from "../entities/turmasEntities";
import { TipoConta } from "../entities/baseEntity";
import ErrorHandler from "../errors/errorHandler";
import { criptografarSenha } from "../utils/senhaUtils";
import { Like } from "typeorm";

export class AlunoService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private alunoRepository = MysqlDataSource.getRepository(Alunos);
  private turmaRepository = MysqlDataSource.getRepository(Turma);

  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

  private dadosAluno(aluno: Alunos) {
    return {
      id: aluno.id,
      nomeCompleto: aluno.membro.nomeCompleto,
      email: aluno.membro.email,
      numeroMatricula: aluno.membro.numeroMatricula,
      cpf: aluno.membro.cpf,
      turma: aluno.turma ? { id: aluno.turma.id } : null,
    };
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

    const turma = await this.turmaRepository.findOne({
      where: { id: dadosAluno.turma },
    });
    if (!turma) {
      throw ErrorHandler.badRequest(
        "Turma não encontrada. Por favor, verifique o ID informado."
      );
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

    const aluno = this.alunoRepository.create({ membro, turma });
    await this.alunoRepository.save(aluno);

    return { message: "Aluno cadastrado com sucesso.", aluno };
  }

  async listarAlunos(
    paginaNumero: number,
    paginaTamanho: number,
    termoDeBusca: string,
    adminId: number
  ) {
    const pular = (paginaNumero - 1) * paginaTamanho;

    const [alunos, total] = await this.alunoRepository.findAndCount({
      relations: ["membro"],
      where: {
        admin: { id: adminId },
        ...(termoDeBusca && {
          membro: { nomeCompleto: Like(`%${termoDeBusca}%`) },
        }),
      },
      order: { membro: { nomeCompleto: "ASC" } },
      skip: pular,
      take: paginaTamanho,
    });

    if (alunos.length === 0) {
      throw ErrorHandler.notFound(
        termoDeBusca
          ? `Nenhum aluno encontrado com o termo "${termoDeBusca}".`
          : "Nenhum aluno cadastrado no momento."
      );
    }

    return {
      message: "Alunos listados com sucesso.",
      data: alunos.map(this.dadosAluno),
      total,
    };
  }

  async atualizarAluno(
    alunoId: number,
    dadosAtualizados: {
      email?: string;
      nomeCompleto?: string;
      numeroMatricula?: string;
      cpf?: string;
      turma?: number;
    },
    adminId: number
  ) {
    await this.iniciarDatabase();

    const aluno = await this.alunoRepository.findOne({
      where: { id: alunoId },
      relations: ["membro", "turma"],
    });

    if (!aluno || aluno.admin.id !== adminId) {
      throw ErrorHandler.notFound("Aluno não encontrado ou acesso negado.");
    }

    if (dadosAtualizados.turma) {
      const turma = await this.turmaRepository.findOneBy({
        id: dadosAtualizados.turma,
      });
      if (!turma) {
        throw ErrorHandler.badRequest("A turma informada não existe.");
      }
      aluno.turma = turma;
    }

    Object.assign(aluno.membro, dadosAtualizados);

    await this.membrosRepository.save(aluno.membro);
    await this.alunoRepository.save(aluno);

    return { message: "Dados do aluno atualizados com sucesso.", aluno };
  }
}
