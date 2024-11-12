import { Professor } from '../entities/professorEntities';
import { MysqlDataSource } from '../config/database';
import { Turma } from '../entities/turmasEntities';
import { Membros } from '../entities/membrosEntities';
import { BaseEntity, TipoConta } from '../entities/baseEntity';
import { In } from 'typeorm';
import { criptografarSenha } from '../utils/senhaUtils';

/**
 * Classe responsável por gerenciar operações relacionadas a Professores.
 */
export class ProfessorService {
  private professorRepository = MysqlDataSource.getRepository(Professor);
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private turmasRepository = MysqlDataSource.getRepository(Turma);
  private baseRepository = MysqlDataSource.getRepository(BaseEntity);

  /**
   * Cria um novo professor e, se necessário, cria um novo membro associado.
   * @param nomeMembro - Nome completo do membro.
   * @param cpf - CPF do membro.
   * @param dataNascimento - Data de nascimento do membro.
   * @param numeroMatricula - Número de matrícula do membro.
   * @param senha - Senha para o professor.
   * @param turmaApelido - Lista de apelidos das turmas associadas ao professor.
   * @param membroId - (Opcional) ID de um membro existente.
   * @returns O professor criado com o membro e turmas associados.
   */
  async criarProfessor(
    nomeMembro: string,
    cpf: string,
    dataNascimento: Date,
    numeroMatricula: string,
    senha: string,
    turmaApelido: string[],
    membroId?: number
  ): Promise<Professor> {
    let membro: Membros | null = null;

    // Verifica se um ID de membro foi fornecido e tenta encontrar o membro associado.
    if (membroId) {
      membro = await this.membrosRepository.findOneBy({ id: membroId });
    }

    // Se o membro não for encontrado ou o ID não for fornecido, cria um novo membro.
    if (!membro) {
      membro = this.membrosRepository.create({
        nomeCompleto: nomeMembro,
        numeroMatricula,
        dataNascimento,
        cpf,
        tipoConta: TipoConta.PROFESSOR
      });
      membro = await this.membrosRepository.save(membro);
    }

    // Busca as turmas associadas pelos apelidos fornecidos.
    const turmas = await this.turmasRepository.findBy({
      turmaApelido: In(turmaApelido)
    });

    // Cria e salva o novo professor com as informações de membro e turmas.
    const novoProfessor = this.professorRepository.create({
      senha: await criptografarSenha(senha),
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
    return await this.professorRepository.find();
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
      where: { id }
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
      where: { id }
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
