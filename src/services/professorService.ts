import { In, Like } from 'typeorm';
import { Professor } from '../entities/professorEntities';
import { Membros } from '../entities/membrosEntities';
import { Turma } from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';
import { criptografarSenha } from '../utils/validarSenhaUtils';
import ErrorHandler from '../errors/errorHandler';
import { MysqlDataSource } from '../config/database';

/**
 * Service responsável por gerenciar operações relacionadas aos dados e processos de Professores no sistema.
 *
 * Inclui funcionalidades como criação, atualização, listagem, exclusão e busca de professores,
 * bem como a associação com turmas.
 *
 * @category Services
 */
export class ProfessorService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private professorRepository = MysqlDataSource.getRepository(Professor);
  private turmaRepository = MysqlDataSource.getRepository(Turma);

  /**
   * Inicializa a conexão com o banco de dados caso ainda não tenha sido inicializada.
   * Este método é chamado antes de cada operação para garantir que a conexão está ativa.
   *
   * @private
   * @returns {Promise<void>}
   */
  private async iniciarDatabase() {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
  }

  /**
   * Formata os dados de um professor em uma estrutura simplificada.
   * Este método prepara dados para envio ao cliente sem expor dados internos.
   *
   * @private
   * @param professor - Objeto Professor que será formatado.
   * @returns Dados simplificados do professor.
   */
  private dadosProfessor(professor: Professor) {
    return {
      id: professor.id,
      nomeCompleto: professor.membro.nomeCompleto,
      numeroMatricula: professor.membro.numeroMatricula,
      email: professor.membro.email,
      cpf: professor.membro.cpf,
      turmas: professor.turmas.map((turma) => ({
        id: turma.id,
        anoLetivo: turma.anoLetivo,
        periodoLetivo: turma.periodoLetivo,
        ensino: turma.ensino,
        turmaApelido: turma.turmaApelido
      }))
    };
  }

  /**
   * Cria um novo professor no sistema, associando-o às turmas correspondentes e criptografando sua senha.
   *
   * @async
   * @param dadosProfessor - Dados necessários para a criação de um novo professor.
   * @param adminCriadorId - ID do administrador que criou este professor.
   * @throws {ErrorHandler.notFound} Caso alguma turma informada não seja encontrada.
   * @returns {Promise<Object>} Mensagem de sucesso e dados do novo professor.
   */
  async criarProfessor(
    dadosProfessor: {
      email: string;
      nomeCompleto: string;
      numeroMatricula: string;
      cpf: string;
      turma: number[];
    },
    adminCriadorId: number
  ) {
    await this.iniciarDatabase();

    const turmas = await this.turmaRepository.find({
      where: { id: In(dadosProfessor.turma) }
    });

    if (turmas.length !== dadosProfessor.turma.length) {
      throw ErrorHandler.notFound(
        'Algumas turmas fornecidas não foram encontradas.'
      );
    }

    const senhaCriptografada = await criptografarSenha(
      dadosProfessor.numeroMatricula
    );

    const membro = this.membrosRepository.create({
      email: dadosProfessor.email,
      nomeCompleto: dadosProfessor.nomeCompleto,
      numeroMatricula: dadosProfessor.numeroMatricula,
      senha: senhaCriptografada,
      cpf: dadosProfessor.cpf,
      tipoConta: TipoConta.PROFESSOR,
      adminCriadorId
    });

    await this.membrosRepository.save(membro);

    const professor = this.professorRepository.create({
      membro,
      turmas
    });

    const novoProfessor = await this.professorRepository.save(professor);

    return {
      message: 'Professor cadastrado com sucesso!',
      professor: novoProfessor
    };
  }

  /**
   * Lista todos os professores associados ao administrador autenticado no sistema.
   *
   * @async
   * @param adminLogadoId - ID do administrador autenticado.
   * @throws {ErrorHandler} Caso haja falha na operação.
   * @returns {Promise<Professor[]>} Lista de professores.
   */
  async listarProfessores(adminLogadoId: number) {
    await this.iniciarDatabase();

    const professores = await this.professorRepository.find({
      where: {
        membro: {
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro']
    });

    return professores;
  }

  /**
   * Lista professores com paginação e aplicação de filtros por termo de busca no nome.
   *
   * @async
   * @param paginaNumero - Número da página.
   * @param paginaTamanho - Quantidade de resultados por página.
   * @param termoDeBusca - Termo para busca por nome.
   * @param adminLogadoId - ID do administrador autenticado.
   * @throws {ErrorHandler.notFound} Caso nenhum professor seja encontrado.
   * @returns {Promise<Object>} Lista paginada com dados relevantes.
   */
  async listarProfessoresPagina(
    paginaNumero: number,
    paginaTamanho: number,
    termoDeBusca: string,
    adminLogadoId: number
  ) {
    const pular = (paginaNumero - 1) * paginaTamanho;

    const [professores, total] = await this.professorRepository.findAndCount({
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

    if (professores.length === 0) {
      throw ErrorHandler.notFound(
        termoDeBusca
          ? `Nenhum professor encontrado com o termo "${termoDeBusca}".`
          : 'Nenhum professor cadastrado no momento.'
      );
    }

    return {
      message: 'Professores listados com sucesso.',
      data: professores.map(this.dadosProfessor),
      total
    };
  }

  /**
   * Busca um professor específico pelo seu ID.
   * Apenas um administrador autenticado pode buscar seu próprio conjunto de professores.
   *
   * @async
   * @param id - ID do professor desejado.
   * @param adminLogadoId - ID do administrador autenticado.
   * @throws {ErrorHandler.notFound} Caso o professor não seja encontrado.
   * @returns {Promise<Professor>} Professor encontrado.
   */
  async buscarProfessorPorId(id: number, adminLogadoId: number) {
    await this.iniciarDatabase();

    const professor = await this.professorRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro']
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado.');
    }

    return professor;
  }

  /**
   * Atualiza as informações de um professor no sistema.
   *
   * @async
   * @param id - ID do professor.
   * @param dadosAtualizados - Dados que devem ser atualizados.
   * @param adminLogadoId - ID do administrador autenticado.
   * @throws {ErrorHandler.notFound} Caso o professor não seja encontrado ou a operação falhe.
   * @returns {Promise<Object>} Mensagem de sucesso e dados atualizados.
   */
  async atualizarProfessor(
    id: number,
    dadosAtualizados: Partial<{
      email?: string;
      senha?: string;
      nomeCompleto?: string;
      numeroMatricula?: string;
      cpf?: string;
      turma?: number[];
    }>,
    adminLogadoId: number
  ) {
    await this.iniciarDatabase();

    const professorExistente = await this.professorRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro', 'turmas', 'admin']
    });

    if (!professorExistente) {
      throw ErrorHandler.notFound('Professor não encontrado ou acesso negado.');
    }

    const membro = professorExistente.membro;

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
      const turmas = await this.turmaRepository.findBy({
        id: In(dadosAtualizados.turma)
      });

      if (turmas.length !== dadosAtualizados.turma.length) {
        throw ErrorHandler.notFound(
          'Algumas turmas fornecidas não foram encontradas.'
        );
      }

      professorExistente.turmas = turmas;
    }

    await this.professorRepository.save(professorExistente);

    return {
      message: 'Professor atualizado com sucesso!',
      professor: professorExistente
    };
  }

  /**
   * Deleta um professor do sistema, removendo-o do banco de dados.
   * Apenas administradores autenticados podem realizar esta operação.
   *
   * @async
   * @param id - ID do professor que deve ser deletado.
   * @param adminLogadoId - ID do administrador que está solicitando a exclusão.
   * @throws {ErrorHandler.notFound} Caso o professor não seja encontrado ou o administrador não tenha permissão.
   * @returns {Promise<Object>} Mensagem de sucesso ao excluir o professor.
   */
  async deletarProfessor(id: number, adminLogadoId: number) {
    await this.iniciarDatabase();

    const professor = await this.professorRepository.findOne({
      where: {
        membro: {
          id,
          adminCriadorId: adminLogadoId
        }
      },
      relations: ['membro']
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado ou acesso negado.');
    }

    await this.professorRepository.remove(professor);

    return { message: 'Professor excluído com sucesso!' };
  }

  /**
   * Busca todas as turmas associadas a um professor específico pelo seu ID.
   *
   * @async
   * @param professorId - ID do professor cujas turmas serão buscadas.
   * @throws {ErrorHandler.notFound} Caso o professor não seja encontrado no banco de dados.
   * @returns {Promise<Array<Object>>} Lista com as turmas do professor, contendo o ID e o apelido da turma.
   */
  async buscarProfessorTurmas(professorId: number) {
    const professor = await this.professorRepository.findOne({
      where: {
        membro: {
          id: professorId
        }
      },
      relations: ['turmas']
    });

    if (!professor) {
      throw ErrorHandler.notFound('Professor não encontrado');
    }

    if (!professor.turmas || !Array.isArray(professor.turmas)) {
      return [];
    }

    return professor.turmas.map((turma) => ({
      id: turma.id,
      turmaApelido: turma.turmaApelido
    }));
  }
}
