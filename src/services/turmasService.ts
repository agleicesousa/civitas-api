import {
  AnoLetivo,
  PeriodoLetivo,
  TipoEnsino,
  Turma
} from '../entities/turmasEntities';
import { Admin } from '../entities/adminEntities';
import { Like, Not } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import ErrorHandler from '../errors/errorHandler';

/**
 * Serviço responsável por operações relacionadas às Turmas.
 */
export class TurmasService {
  private turmasRepository = MysqlDataSource.getRepository(Turma);
  private adminRepository = MysqlDataSource.getRepository(Admin);

  /**
   * Mapeia os dados de uma turma para um formato simplificado.
   * @param turma - Objeto da entidade Turma.
   * @returns Um objeto com dados simplificados da turma.
   */
  private mapTurma(turma: Turma) {
    const { id, turmaApelido, anoLetivo, periodoLetivo } = turma;
    return {
      id,
      turmaApelido,
      anoLetivo,
      periodoLetivo
    };
  }

  /**
   * Cria uma nova turma associada a um administrador.
   * @param anoLetivo - Ano letivo da turma.
   * @param periodoLetivo - Período letivo (semestre, bimestre, etc.).
   * @param ensino - Tipo de ensino (ex.: Fundamental, Médio).
   * @param turmaApelido - Apelido ou nome da turma.
   * @param adminCriadorId - ID do administrador criador.
   * @returns A turma recém-criada.
   * @throws Conflito caso a turma já exista ou erro de validação.
   */
  async criar(
    anoLetivo: AnoLetivo,
    periodoLetivo: PeriodoLetivo,
    ensino: TipoEnsino,
    turmaApelido: string,
    adminCriadorId: number
  ): Promise<Turma> {
    const turmaExistente = await this.turmasRepository.findOne({
      where: {
        turmaApelido,
        admin: {
          membro: { id: adminCriadorId }
        }
      }
    });

    if (turmaExistente) {
      throw ErrorHandler.conflictError('Turma já foi cadastrada');
    }

    if (turmaApelido.length > 12) {
      throw ErrorHandler.badRequest('O apelido da turma é muito longo');
    }

    const admin = await this.adminRepository.findOneBy({
      membro: { id: adminCriadorId }
    });

    const novaTurma = this.turmasRepository.create({
      anoLetivo,
      periodoLetivo,
      ensino,
      turmaApelido,
      admin
    });

    return await this.turmasRepository.save(novaTurma);
  }

  /**
   * Lista as turmas associadas a um administrador, com suporte a paginação e busca.
   * @param adminCriadorId - ID do administrador logado.
   * @param paginaNumero - Número da página atual.
   * @param paginaTamanho - Tamanho de itens por página.
   * @param searchTerm - Termo de busca para filtrar turmas.
   * @returns Um objeto contendo total de registros e dados paginados.
   */
  async listar(
    adminCriadorId: number,
    paginaNumero: number,
    paginaTamanho: number | null,
    searchTerm: string
  ) {
    const offset = (paginaNumero - 1) * (paginaTamanho ?? 0);
    const [turmas, total] = await this.turmasRepository.findAndCount({
      where: {
        admin: {
          membro: { id: adminCriadorId }
        },
        turmaApelido: Like(`%${searchTerm}%`)
      },
      skip: paginaTamanho ? offset : undefined,
      take: paginaTamanho || undefined
    });
    const turmasMap = turmas.map(this.mapTurma);
    return {
      total,
      data: turmasMap
    };
  }

  /**
   * Busca uma turma específica pelo ID.
   * @param id - ID da turma.
   * @param adminCriadorId - ID do administrador logado.
   * @returns A turma encontrada.
   * @throws Erro caso a turma não exista ou não pertença ao administrador.
   */
  async buscarTurmaPorId(id: number, adminCriadorId: number): Promise<Turma> {
    const turmaExistente = await this.turmasRepository.findOne({
      where: {
        id,
        admin: {
          membro: { id: adminCriadorId }
        }
      }
    });

    if (!turmaExistente) {
      throw ErrorHandler.notFound(
        'Turma não encontrada ou não pertence ao admin logado.'
      );
    }

    return turmaExistente;
  }

  /**
   * Edita os dados de uma turma específica.
   * @param id - ID da turma a ser editada.
   * @param dadosTurma - Novos dados da turma.
   * @param adminCriadorId - ID do administrador logado.
   * @returns A turma atualizada.
   * @throws Erro caso a turma não exista, conflito de apelido ou falta de permissão.
   */
  async editar(id: number, dadosTurma: Partial<Turma>, adminCriadorId: number) {
    const turmaExistente = await this.turmasRepository.findOne({
      where: { id },
      relations: ['admin', 'admin.membro']
    });

    if (!turmaExistente) {
      throw ErrorHandler.notFound('Turma não encontrada');
    }

    if (turmaExistente.admin.membro.id !== adminCriadorId) {
      throw ErrorHandler.unauthorized(
        'Você não tem permissão para editar esta turma'
      );
    }

    if (dadosTurma.turmaApelido) {
      const apelidoExistente = await this.turmasRepository.findOne({
        where: {
          turmaApelido: dadosTurma.turmaApelido,
          id: Not(id)
        }
      });

      if (apelidoExistente) {
        throw ErrorHandler.conflictError('O apelido da turma já existe');
      }
    }

    Object.assign(turmaExistente, dadosTurma);
    return await this.turmasRepository.save(turmaExistente);
  }

  /**
   * Exclui uma turma pelo ID.
   * @param id - ID da turma a ser deletada.
   * @param adminCriadorId - ID do administrador logado.
   * @returns O resultado da operação de exclusão.
   * @throws Erro caso a turma não exista ou o administrador não tenha permissão.
   */
  async deletar(id: number, adminCriadorId: number) {
    const turmaExistente = await this.turmasRepository.findOne({
      where: { id },
      relations: ['admin', 'admin.membro']
    });

    if (!turmaExistente) {
      throw ErrorHandler.notFound('Turma não encontrada');
    }

    if (turmaExistente.admin.membro.id !== adminCriadorId) {
      throw ErrorHandler.unauthorized(
        'Você não tem permissão para excluir esta turma'
      );
    }

    return await this.turmasRepository.delete(id);
  }

  /**
   * Busca os alunos associados a uma turma específica.
   * @param turmaId - ID da turma.
   * @returns Lista simplificada de alunos da turma.
   * @throws Erro caso a turma não exista.
   */
  async buscarAlunosPorTurma(turmaId: number) {
    const turma = await this.turmasRepository.findOne({
      where: { id: turmaId },
      relations: ['alunos', 'alunos.membro']
    });

    if (!turma) {
      throw ErrorHandler.notFound('Turma não encontrada');
    }

    if (!turma.alunos || turma.alunos.length === 0) {
      return [];
    }

    const listaAlunos = turma.alunos.map((aluno) => ({
      id: aluno.id,
      name: aluno.membro.nomeCompleto,
      performance: aluno.desempenho
    }));

    return listaAlunos;
  }
}
