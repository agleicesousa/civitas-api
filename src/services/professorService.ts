import { Professor } from '../entities/professorEntities';
import { MysqlDataSource } from '../config/database';
import { Turma } from '../entities/turmasEntities';
import { Membros } from '../entities/membrosEntities';

/**
 * Classe responsável por gerenciar operações relacionadas a Professores.
 */
export class ProfessorService {
  private professorRepository = MysqlDataSource.getRepository(Professor);
  private membrosRepository = MysqlDataSource.getRepository(Membros);

  /**
   * Cria um novo professor.
   *
   * @param senha - A senha do professor.
   * @param turmas - Lista de turmas associadas ao professor.
   * @param membroId - ID do membro associado ao professor.
   * @throws Error se o membro não for encontrado
   * @returns O professor criado.
   */
  async criarProfessor(
    senha: string,
    turmas: Turma[],
    membroId: number
  ): Promise<Professor> {
    const membro = await this.membrosRepository.findOneBy({ id: membroId });

    if (!membro) {
      throw new Error(`Membro com ID ${membroId} não encontrado`);
    }

    const novoProfessor = this.professorRepository.create({
      senha,
      membro,
      turmas
    });

    return await this.professorRepository.save(novoProfessor);
  }
  /**
   * Lista todos os professores.
   *
   * @returns Uma lista de professores.
   */
  async listarProfessores(): Promise<Professor[]> {
    return await this.professorRepository.find({
      relations: ['membro', 'turmas']
    });
  }
  /**
   * Busca um professor pelo seu ID.
   *
   * @param id - O ID do professor.
   * @throws Error se o professor não for encontrado
   * @returns O professor correspondente ao ID fornecido.
   */
  async buscarProfessorPorId(id: number): Promise<Professor> {
    const professor = await this.professorRepository.findOne({
      where: { id },
      relations: ['membro', 'turmas']
    });

    if (!professor) {
      throw new Error(`Professor com ID ${id} não encontrado`);
    }

    return professor;
  }

  /**
   * Deleta um professor pelo seu ID.
   *
   * @param id - O ID do professor a ser deletado.
   * @throws Error se o professor não for encontrado
   * @returns O resultado da operação de deleção.
   */
  async deletarProfessor(id: number) {
    const resultado = await this.professorRepository.delete(id);

    if (resultado.affected === 0) {
      throw new Error(`Professor com ID ${id} não encontrado`);
    }
    return resultado;
  }
  /**
   * Edita os detalhes de um professor existente.
   *
   * @param id - O ID do professor a ser editado.
   * @param turmas - Novas turmas associadas ao professor || null se não houver turmas.
   * @param senha - A nova senha do professor.
   * @param membroId - O ID do membro a ser associado ao professor.
   * @returns O professor atualizado.
   */
  async editar(
    id: number,
    turmas: Turma[] | null,
    senha: string,
    membroId: number
  ) {
    const membro = await this.membrosRepository.findOneBy({ id: membroId });

    if (!membro) {
      throw new Error(`Membro com ID ${membroId} não encontrado`);
    }

    const professorExistente = await this.professorRepository.findOneBy({ id });

    if (!professorExistente) {
      throw new Error(`Professor com ID ${id} não encontrado`);
    }

    Object.assign(professorExistente, {
      senha,
      membro,
      turmas: turmas || professorExistente.turmas
    });

    return await this.professorRepository.save(professorExistente);
  }
}
