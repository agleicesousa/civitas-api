import { MysqlDataSource } from '../config/database';
import { Turma } from '../entities/turmasEntities';
import { Membros } from '../entities/membrosEntities';
import { Alunos } from '../entities/alunosEntities';
import { TipoConta } from '../entities/baseEntity';
import { Responsaveis } from '../entities/responsaveisEntities';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflitctError';

export class AlunosService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private alunosRepository = MysqlDataSource.getRepository(Alunos);
  private turmasRepository = MysqlDataSource.getRepository(Turma);
  private responsaveisRepository = MysqlDataSource.getRepository(Responsaveis);

  /**
   * Cria um novo aluno no sistema.
   * @param nomeCompleto - O nome completo do aluno.
   * @param rg - O RG do aluno.
   * @param numeroMatricula - O número de matrícula do aluno.
   * @param turmaId - O ID da turma à qual o aluno pertence.
   * @param responsavelCpf - O CPF do responsável associado ao aluno.
   *
   * @returns Uma promessa que resolve para o objeto Alunos criado.
   */
  async criarAluno(
    nomeCompleto: string,
    rg: string,
    numeroMatricula: string,
    turmaId: number,
    responsavelCpf: string
  ): Promise<Alunos> {
    const membroEstudante = await this.membrosRepository.findOne({
      where: {
        numeroMatricula
      }
    });
    if (membroEstudante) {
      throw new ConflictError('Estudante já existe nos cadastros');
    }

    const membro = this.membrosRepository.create({
      nomeCompleto,
      rg,
      numeroMatricula,
      tipoConta: TipoConta.ALUNO
    });
    await this.membrosRepository.save(membro);

    const turma = await this.turmasRepository.findOne({
      where: { id: turmaId }
    });

    const responsavel = await this.responsaveisRepository.findOne({
      where: {
        membro: {
          cpf: responsavelCpf
        }
      }
    });

    const aluno = this.alunosRepository.create({
      membro,
      turma,
      responsavel
    });

    return await this.alunosRepository.save(aluno);
  }
  /**
   * Lista todos os alunos no sistema, incluindo suas turmas, membros e responsáveis.
   *
   * @returns Uma promessa que resolve para uma lista de alunos com suas respectivas turmas, membros e responsáveis.
   */
  async listarAlunos(): Promise<Alunos[]> {
    return await this.alunosRepository.find({
      relations: ['membro', 'turma', 'responsavel']
    });
  }

  /**
   * Busca um aluno pelo seu ID.
   *
   * @param id - O ID do aluno a ser buscado.
   * @returns Uma promessa que resolve para o aluno encontrado.
   */
  async buscarAlunoPorId(id: number): Promise<Alunos> {
    const aluno = await this.alunosRepository.findOne({
      where: { id },
      relations: ['membro', 'turma', 'responsavel']
    });

    if (!aluno) {
      throw new NotFoundError('Aluno não encontrado.');
    }

    return aluno;
  }

  /**
   * Deleta um aluno e seu membro associado pelo ID.
   *
   * @param id - O ID do aluno a ser deletado.
   */
  async deletarAluno(id: number) {
    const aluno = await this.alunosRepository.findOne({
      where: { id },
      relations: ['membro']
    });

    if (!aluno) {
      throw new NotFoundError('Aluno não encontrado.');
    }

    await this.alunosRepository.delete(id);
    await this.membrosRepository.delete(aluno.membro.id);
  }

  /**
   * Edita as informações de um aluno existente.
   *
   * @param id - O ID do aluno a ser editado.
   * @param nomeCompleto - Novo nome completo do aluno.
   * @param rg - Novo RG do aluno.
   * @param numeroMatricula - Novo número de matrícula do aluno.
   * @param turmaId - ID da nova turma do aluno.
   * @param responsavelCpf - CPF do responsável associado.
   * @returns Uma promessa que resolve para o aluno atualizado.
   * @throws Error se o aluno, turma ou responsável não forem encontrados.
   */
  async editarAluno(
    id: number,
    nomeCompleto: string,
    rg: string,
    numeroMatricula: string,
    turmaId: number,
    responsavelCpf: string
  ): Promise<Alunos> {
    const aluno = await this.alunosRepository.findOneBy({ id });

    if (!aluno) {
      throw new NotFoundError('Aluno não encontrado.');
    }

    await this.membrosRepository.update(aluno.membro.id, {
      nomeCompleto,
      rg,
      numeroMatricula,
      tipoConta: TipoConta.ALUNO
    });

    const turma = await this.turmasRepository.findOne({
      where: { id: turmaId }
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    const responsavel = await this.responsaveisRepository.findOne({
      where: {
        membro: {
          cpf: responsavelCpf
        }
      }
    });
    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    await this.alunosRepository.update(id, {
      turma,
      responsavel
    });

    return await this.alunosRepository.findOne({
      where: { id },
      relations: ['membro', 'turma', 'responsavel']
    });
  }
}
