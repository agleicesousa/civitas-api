import { Professor } from '../entities/professorEntities';
import { MysqlDataSource } from '../config/database';
import { Turma } from '../entities/turmasEntities';
import { Membros } from '../entities/membrosEntities';
import { In } from 'typeorm';
import { criptografarSenha } from '../utils/senhaUtils';
/**
 * Classe responsável por gerenciar operações relacionadas a Professores.
 */
export class ProfessorService {
  private professorRepository = MysqlDataSource.getRepository(Professor);
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private turmasRepository = MysqlDataSource.getRepository(Turma);

  /**
   * Cria um novo professor.
   *
   * @param senha - A senha do professor.
   * @param turmasApelido - Array de apelidos das turmas associadas ao professor.
   * @param membroId - ID do membro associado ao professor.
   * @throws Error se o membro não for encontrado
   * @returns O professor criado.
   */
  async criarProfessor(
    senha: string,
    membroId: number,
    turmaApelido: string[]
  ): Promise<Professor> {
    const membro = await this.membrosRepository.findOneBy({ id: membroId });

    if (!membro) {
      throw new Error(`Membro com ID ${membroId} não encontrado`);
    }

    const turmas = await this.turmasRepository.findBy({
      turmaApelido: In(turmaApelido)
    });

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
    const professor = await this.professorRepository.findOne({
      where: { id },
      relations: ['membro']
    });

    if (!professor) {
      throw new Error(`Professor com ID ${id} não encontrado`);
    }
    await this.professorRepository.delete(id);
    await this.membrosRepository.delete(professor.membro.id);
  }
  /**
   * Atualiza os dados de um professor existente.
   *
   * @param id - ID do professor que será atualizado.
   * @param turmasApelidos - Array de apelidos das novas turmas que serão associadas ao professor;
   * @param senha - Nova senha do professor.
   * @param membroId - ID do membro que será associado ao professor.
   * @returns Retorna o professor atualizado com as novas associações e dados.
   * @throws Lança um erro se o professor ou membro não forem encontrados.
   */
  async editarProfessor(
    id: number,
    turmasApelidos: string[],
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

    const turmas = await this.turmasRepository.findBy({
      turmaApelido: In(turmasApelidos)
    });

    professorExistente.senha = await criptografarSenha(senha);

    Object.assign(professorExistente, {
      membro,
      turmas: turmas || professorExistente.turmas
    });

    return await this.professorRepository.save(professorExistente);
  }
}
