import { MysqlDataSource } from '../config/database';
import { Membros } from '../entities/membrosEntities';
import { Alunos } from '../entities/alunosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
import ErrorHandler from '../errors/errorHandler';
import { criptografarSenha } from '../utils/validarSenhaUtils';
import { Like } from 'typeorm';

/**
 * Serviço responsável por gerenciar operações relacionadas a Alunos no sistema.
 */
export class AlunoService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private alunoRepository = MysqlDataSource.getRepository(Alunos);
  private turmaRepository = MysqlDataSource.getRepository(Turma);

  /**
   * Inicializa a conexão com o banco de dados caso ainda não esteja ativa.
   * @private
   */
  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

  /**
   * Formata os dados do aluno para retorno no formato desejado.
   * @param aluno - Entidade do aluno.
   * @returns Um objeto contendo os dados do aluno.
   * @private
   */
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

  /**
   * Cria um novo aluno no sistema.
   * @param dadosAluno - Dados necessários para criação do aluno.
   * @param adminCriadorId - ID do administrador responsável pela criação.
   * @throws ErrorHandler - Caso a turma não seja encontrada.
   * @returns Mensagem de sucesso e os dados do aluno criado.
   */
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

  /**
   * Lista todos os alunos cadastrados vinculados a um administrador específico.
   * @param adminLogadoId - ID do administrador logado.
   * @returns Uma lista de alunos vinculados ao administrador.
   */
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

  /**
   * Busca um aluno pelo ID, garantindo que pertence ao administrador logado.
   * @param id - ID do aluno.
   * @param adminLogadoId - ID do administrador logado.
   * @throws ErrorHandler - Caso o aluno não seja encontrado.
   * @returns Dados do aluno encontrado.
   */
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
      throw ErrorHandler.notFound('Aluno não encontrado.');
    }

    return aluno;
  }

  /**
   * Lista os alunos com paginação e opção de busca por nome.
   * @param paginaNumero - Número da página.
   * @param paginaTamanho - Quantidade de itens por página.
   * @param termoDeBusca - Termo de busca para filtrar alunos pelo nome.
   * @param adminLogadoId - ID do administrador logado.
   * @throws ErrorHandler - Caso nenhum aluno seja encontrado.
   * @returns Um objeto com a lista de alunos paginada e o total de registros.
   */
  async listarAlunos(
    paginaNumero: number,
    paginaTamanho: number,
    termoDeBusca: string,
    adminLogadoId: number
  ) {
    const pular = (paginaNumero - 1) * paginaTamanho;

    const [alunos, total] = await this.alunoRepository.findAndCount({
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

    if (alunos.length === 0) {
      throw ErrorHandler.notFound(
        termoDeBusca
          ? `Nenhum aluno encontrado com o termo "${termoDeBusca}".`
          : 'Nenhum aluno cadastrado no momento.'
      );
    }

    return {
      message: 'Alunos listados com sucesso.',
      data: alunos.map(this.dadosAluno),
      total
    };
  }

  /**
   * Atualiza os dados de um aluno específico.
   * @param id - ID do aluno a ser atualizado.
   * @param dadosAtualizados - Novos dados do aluno.
   * @param adminLogadoId - ID do administrador logado.
   * @throws ErrorHandler - Caso o aluno não seja encontrado ou a turma informada não exista.
   * @returns Mensagem de sucesso e os dados atualizados do aluno.
   */
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

    const aluno = await this.alunoRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro', 'turma']
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

  /**
   * Exclui um aluno do sistema.
   * @param id - ID do aluno a ser excluído.
   * @param adminId - ID do administrador logado.
   * @throws ErrorHandler - Caso o aluno não seja encontrado ou o acesso seja negado.
   * @returns Mensagem de confirmação da exclusão.
   */
  async excluirAluno(id: number, adminId: number) {
    await this.iniciarDatabase();

    const aluno = await this.alunoRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminId
        }
      },
      relations: ['membro']
    });

    if (!aluno) {
      throw ErrorHandler.notFound('Aluno não encontrado ou acesso negado.');
    }

    await this.membrosRepository.remove(aluno.membro);
    await this.alunoRepository.remove(aluno);

    return { message: 'Aluno excluído com sucesso.' };
  }
}
