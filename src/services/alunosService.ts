import { MysqlDataSource } from '../config/database';
import { Turma } from '../entities/turmasEntities';
import { Membros } from '../entities/membrosEntities';
import { Alunos } from '../entities/alunosEntities';
import { TipoConta } from '../entities/baseEntity';
import { Responsaveis } from '../entities/responsaveisEntities';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflitctError';
import { FindManyOptions, Like } from 'typeorm';
export class AlunosService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private alunosRepository = MysqlDataSource.getRepository(Alunos);
  private turmasRepository = MysqlDataSource.getRepository(Turma);
  private responsaveisRepository = MysqlDataSource.getRepository(Responsaveis);

  private mapAluno(aluno: Alunos) {
    const { id, membro} = aluno;
    const { nomeCompleto, numeroMatricula } = membro;
    return {
      id,
      nomeCompleto,
      numeroMatricula
    }
  }

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
    //Mudar depois
    if (!numeroMatricula) {
      throw new Error('Mátricula é obrigatória');
    }
    //Se estudante já foi cadastrado retorna um error
    const membroEstudante = await this.membrosRepository.findOne({
      where: [{ numeroMatricula }, { rg }]
    });
    if (membroEstudante) {
      throw new ConflictError('Aluno já existe nos cadastros');
    }

    const dadosEstudante = this.membrosRepository.create({
      nomeCompleto,
      rg,
      numeroMatricula,
      tipoConta: TipoConta.ALUNO
    });
    await this.membrosRepository.save(dadosEstudante);

    const turma = await this.turmasRepository.findOne({
      where: { id: turmaId }
    });

    //Checa se responsavel pelo aluno já exite
    let responsavel = await this.responsaveisRepository.findOne({
      where: {
        membro: {
          cpf: responsavelCpf
        }
      }
    });
    //Mudar depois
    //Se não existe, cria um responsavel no momento do cadastro do aluno
    if (!responsavel) {
      const dadosResponsavel = await this.membrosRepository.create({
        cpf: responsavelCpf,
        tipoConta: TipoConta.RESPONSAVEL,
        nomeCompleto: ''
      });

      await this.membrosRepository.save(dadosResponsavel);
      responsavel = await this.responsaveisRepository.create({
        membro: dadosResponsavel
      });
      await this.responsaveisRepository.save(responsavel);
    }

    const aluno = this.alunosRepository.create({
      membro: dadosEstudante,
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
  async listarAlunos(
    paginaNumero: number,
    paginaTamanho: number,
    termoDeBusca: string,
    adminId: number
  ) {
    const pular = (paginaNumero - 1) * paginaTamanho;

    try {
      const opcoesBusca: FindManyOptions<Alunos> = {
        relations: ['membro'],
        where: {
          admin: { id: adminId },
          ...(termoDeBusca && {
            membro: { nomeCompleto: Like(`%${termoDeBusca}%`) }
          })
        },
        order: {
          membro: {
            nomeCompleto: 'ASC'
          }
        }
      };

      if (paginaTamanho && paginaTamanho > 0) {
        opcoesBusca.skip = pular;
        opcoesBusca.take = paginaTamanho;
      }

      const [alunos, total] =
        await this.alunosRepository.findAndCount(opcoesBusca);
      const alunosMap = alunos.map(this.mapAluno);

      return {
        data: alunosMap,
        total
      };
    } catch (error) {
      throw new NotFoundError('Error ao buscar alunos');
    }
  }

  /**
   * Busca um aluno pelo seu ID.
   *
   * @param id - O ID do aluno a ser buscado.
   * @returns Uma promessa que resolve para o aluno encontrado.
   */
  async buscarAlunoPorId(id: number) {
    const aluno = await this.alunosRepository.findOne({
      where: { id },
      relations: ['membro', 'turma', 'responsavel']
    });

    if (!aluno) {
      throw new NotFoundError('Aluno não encontrado.');
    }

    const alunoMap = {
      id: aluno.id,
      numeroMatricula: aluno.membro.numeroMatricula,
      nomeCompleto: aluno.membro.nomeCompleto,
      rg: aluno.membro.rg,
      turmaId: aluno.turma?.id ?? null,
      responsavelCpf: aluno.responsavel?.membro?.cpf ?? null
    };

    return alunoMap;
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
