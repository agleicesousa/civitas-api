import { Professor } from '../entities/professorEntities';
import { MysqlDataSource } from '../config/database';
import { Turma } from '../entities/turmasEntities';
import { Membros } from '../entities/membrosEntities';
import { BaseEntity, TipoConta } from '../entities/baseEntity';
import { In } from 'typeorm';

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
   * @param turmaApelido - Lista de apelidos das turmas associadas ao professor.
   * @param membroId - (Opcional) ID de um membro existente.
   * @param adminId - ID do admin que está criando o professor.
   * @returns O professor criado com o membro e turmas associados.
   */
  async criarProfessor(
    nomeMembro: string,
    cpf: string,
    dataNascimento: Date,
    numeroMatricula: string,
    turmaApelido: string[],
    membroId ? : number,
    adminId: number
  ): Promise < Professor > {
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

    // Busca o admin pelo ID fornecido
    const admin = await this.membrosRepository.findOneBy({ id: adminId });

    if (!admin) {
      throw new Error('Admin não encontrado');
    }

    // Cria e salva o novo professor com as informações de membro, turmas e admin.
    const novoProfessor = this.professorRepository.create({
      membro,
      turmas,
      admin
    });

    return await this.professorRepository.save(novoProfessor);
  }

  /**
   * Lista todos os professores criados pelo admin específico.
   *
   * @param adminId - ID do admin que está buscando os professores.
   * @returns Uma lista de professores associados ao admin.
   */
  async listarProfessores(adminId: number): Promise < Professor[] > {
    return this.professorRepository.find({
      where: {
        admin: { id: adminId }
      }
    });
  }

  /**
   * Busca um professor pelo seu ID, garantindo que o admin seja o responsável por gerenciá-lo.
   *
   * @param id - O ID do professor.
   * @param adminId - ID do admin que está tentando acessar o professor.
   * @throws Error se o professor não for encontrado ou não for associado ao admin.
   * @returns O professor correspondente ao ID fornecido.
   */
  async buscarProfessorPorId(id: number, adminId: number): Promise < Professor > {
    const professor = await this.professorRepository.findOne({
      where: {
        id,
        admin: { id: adminId }
      }
    });

    if (!professor) {
      throw new Error(`Professor com ID ${id} não encontrado ou não autorizado`);
    }

    return professor;
  }

  /**
   * Deleta um professor pelo seu ID, garantindo que o admin seja o responsável por excluí-lo.
   *
   * @param id - O ID do professor a ser deletado.
   * @param adminId - ID do admin que está tentando excluir o professor.
   * @throws Error se o professor não for encontrado ou não for associado ao admin.
   * @returns O resultado da operação de deleção.
   */
  async deletarProfessor(id: number, adminId: number): Promise < void > {
    const professor = await this.professorRepository.findOne({
      where: {
        id,
        admin: { id: adminId }
      }
    });

    if (!professor) {
      throw new Error(`Professor com ID ${id} não encontrado ou não autorizado`);
    }

    await this.professorRepository.delete(id);
  }

  /**
   * Atualiza os dados de um professor, garantindo que o admin seja o responsável pela atualização.
   *
   * @param id - ID do professor que será atualizado.
   * @param turmasApelidos - Array de apelidos das novas turmas que serão associadas ao professor;
   * @param membroId - ID do membro que será associado ao professor.
   * @param adminId - ID do admin que está atualizando o professor.
   * @returns Retorna o professor atualizado com as novas associações e dados.
   * @throws Lança um erro se o professor ou membro não forem encontrados, ou se o admin não for o responsável.
   */
  async editarProfessor(
    id: number,
    turmasApelidos: string[],
    membroId: number,
    adminId: number
  ) {
    const membro = await this.membrosRepository.findOneBy({ id: membroId });

    if (!membro) {
      throw new Error(`Membro com ID ${membroId} não encontrado`);
    }

    const professorExistente = await this.professorRepository.findOneBy({ id });

    if (!professorExistente || professorExistente.admin.id !== adminId) {
      throw new Error(`Professor com ID ${id} não encontrado ou não autorizado`);
    }

    const turmas = await this.turmasRepository.findBy({
      turmaApelido: In(turmasApelidos)
    });

    Object.assign(professorExistente, {
      membro,
      turmas: turmas || professorExistente.turmas
    });

    return await this.professorRepository.save(professorExistente);
  }
}