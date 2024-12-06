import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { Alunos } from '../entities/alunosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
import ErrorHandler from '../errors/errorHandler';
import { criptografarSenha } from '../utils/validarSenhaUtils';
import { Like } from 'typeorm';

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
      turma: aluno.turma ? { id: aluno.turma.id } : null
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
      where: { id: dadosAluno.turma }
    });
    if (!turma) {
      throw ErrorHandler.badRequest(
        'Turma não encontrada. Por favor, verifique o ID informado.'
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
      adminCriadorId
    });

    await this.membrosRepository.save(membro);

    const aluno = this.alunoRepository.create({ membro, turma });
    await this.alunoRepository.save(aluno);

    return { message: 'Aluno cadastrado com sucesso.', aluno };
  }

  async listarAlunosCompleto(adminLogadoId: number) {
    await this.iniciarDatabase();

    const alunos = await this.alunoRepository.find({
      where: {
        membro: {
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro']
    });

    return alunos;
  }

  async buscarAlunoPorId(id: number, adminLogadoId: number) {
    await this.iniciarDatabase();

    const aluno = await this.alunoRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro']
    });

    if (!aluno) {
      throw ErrorHandler.notFound('Professor não encontrado.');
    }

    return aluno;
  }

  async listarAlunos(
    paginaNumero: number,
    paginaTamanho: number,
    termoDeBusca: string,
    adminLogadoId: number
  ) {
    const pular = (paginaNumero - 1) * paginaTamanho;

    const [aluno, total] = await this.alunoRepository.findAndCount({
      relations: ['membro'],
      where: {
        membro: {
          adminCriadorId: adminLogadoId,
          ...(termoDeBusca && { nomeCompleto: Like(`%${termoDeBusca}%`) })
        }
      },
      order: { membro: { nomeCompleto: 'ASC' } },
      skip: pular,
      take: paginaTamanho
    });

    if (aluno.length === 0) {
      throw ErrorHandler.notFound(
        termoDeBusca
          ? `Nenhum professor encontrado com o termo "${termoDeBusca}".`
          : 'Nenhum professor cadastrado no momento.'
      );
    }

    return {
      message: 'Alunos listados com sucesso.',
      data: aluno.map(this.dadosAluno),
      total
    };
  }

  async atualizarAluno(
    id: number,
    dadosAtualizados: {
      email?: string;
      nomeCompleto?: string;
      senha?: string;
      numeroMatricula?: string;
      cpf?: string;
      turma?: number;
    },
    adminLogadoId: number
  ) {
    await this.iniciarDatabase();

    // Busca o aluno garantindo que pertence ao admin logado
    const aluno = await this.alunoRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro', 'turma', 'admin']
    });

    if (!aluno) {
      throw ErrorHandler.notFound('Aluno não encontrado ou acesso negado.');
    }

    const membro = aluno.membro;
    Object.assign(membro, {
      email: dadosAtualizados.email ?? membro.email,
      nomeCompleto: dadosAtualizados.nomeCompleto ?? membro.nomeCompleto,
      cpf: dadosAtualizados.cpf ?? membro.cpf,
      numeroMatricula:
        dadosAtualizados.numeroMatricula ?? membro.numeroMatricula,
      senha: dadosAtualizados.senha
        ? await criptografarSenha(dadosAtualizados.senha)
        : membro.senha
    });

    await this.membrosRepository.save(membro);

    if (dadosAtualizados.turma) {
      const turma = await this.turmaRepository.findOne({
        where: { id: dadosAtualizados.turma }
      });

      if (!turma) {
        throw ErrorHandler.badRequest('A turma informada não existe.');
      }

      aluno.turma = turma;
    }

    await this.alunoRepository.save(aluno);

    return {
      message: 'Dados do aluno atualizados com sucesso.',
      aluno: this.dadosAluno(aluno)
    };
  }

  async excluirAluno(alunoId: number, adminId: number) {
    await this.iniciarDatabase();

    const aluno = await this.alunoRepository.findOne({
      where: { id: alunoId },
      relations: ['membro', 'admin']
    });

    if (!aluno || aluno.admin.id !== adminId) {
      throw ErrorHandler.notFound('Aluno não encontrado ou acesso negado.');
    }

    await this.membrosRepository.remove(aluno.membro);
    await this.alunoRepository.remove(aluno);

    return { message: 'Aluno excluído com sucesso.' };
  }
}
