import { MysqlDataSource } from '../config/database';
import { Turma } from '../entities/turmasEntities';
import { Membros } from '../entities/membrosEntities';
import { Alunos } from '../entities/alunosEntities';
import { TipoConta } from '../entities/baseEntity';
import { Responsaveis } from '../entities/responsaveisEntities';

export class AlunosService {
  private membrosRepository = MysqlDataSource.getRepository(Membros);
  private alunosRepository = MysqlDataSource.getRepository(Alunos);
  private turmasRepository = MysqlDataSource.getRepository(Turma);
  private responsaveisRepository = MysqlDataSource.getRepository(Responsaveis);
  async criarAluno(
    nomeCompleto: string,
    rg: string,
    numeroMatricula: string,
    turmaId: number,
    responsavelCpf: string
  ): Promise<Alunos> {
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

  async listarAlunos(): Promise<Alunos[]> {
    return await this.alunosRepository.find({
      relations: ['membro', 'turma', 'responsavel']
    });
  }
  async buscarAlunoPorId(id: number): Promise<Alunos> {
    return await this.alunosRepository.findOne({
      where: { id },
      relations: ['membro', 'turma', 'responsavel']
    });
  }

  async deletarAluno(id: number) {
    const aluno = await this.alunosRepository.findOne({
      where: { id },
      relations: ['membro']
    });

    await this.membrosRepository.delete(aluno.membro.id);
    return await this.alunosRepository.delete(id);
  }
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
      throw new Error('Aluno não encontrado');
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

    return await this.alunosRepository.findOneBy({ id });
  }
}
