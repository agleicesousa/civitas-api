import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Admin } from './adminEntities';
import { Alunos } from './alunosEntities';
import { Professor } from './professorEntities';

/**
 * Enum representando os anos letivos disponíveis no sistema.
 */
export enum AnoLetivo {
  ANO_1 = '1º ano',
  ANO_2 = '2º ano',
  ANO_3 = '3º ano',
  ANO_4 = '4º ano',
  ANO_5 = '5º ano',
  ANO_6 = '6º ano'
}

/**
 * Enum representando os períodos letivos do dia.
 */
export enum PeriodoLetivo {
  MANHA = 'Manhã',
  TARDE = 'Tarde',
  NOITE = 'Noite'
}

/**
 * Enum representando os tipos de ensino oferecidos.
 */
export enum TipoEnsino {
  MATERNAL = 'Maternal',
  PRE_ESCOLA = 'Pré-escola',
  ENSINO_FUNDAMENTAL_1 = 'Ensino fundamental 1'
}

/**
 * Entidade principal para representar as turmas no sistema escolar.
 * Relaciona-se com Administradores, Alunos e Professores.
 */
@Entity('turmas')
export class Turma extends BaseEntity {
  /** Apelido da turma (identificação). */
  @Column({ type: 'varchar', length: 12 })
  turmaApelido: string;

  /** Ano letivo da turma. */
  @Column({ type: 'enum', enum: AnoLetivo })
  anoLetivo: AnoLetivo;

  /** Período letivo da turma. */
  @Column({ type: 'enum', enum: PeriodoLetivo })
  periodoLetivo: PeriodoLetivo;

  /** Tipo de ensino da turma. */
  @Column({ type: 'enum', enum: TipoEnsino })
  ensino: TipoEnsino;

  /** ID do administrador responsável por criar a turma. */
  @Column({ nullable: true })
  adminCriadorId: number;

  /**
   * Relacionamento com a entidade Admin.
   * Representa o administrador responsável por criar a turma.
   */
  @ManyToOne(() => Admin, { eager: true, nullable: false })
  @JoinColumn({ name: 'adminCriadorId' })
  admin: Admin;

  /**
   * Relacionamento com a entidade Alunos.
   * Representa os alunos associados à turma. Relacionamento OneToMany.
   */
  @OneToMany(() => Alunos, (aluno) => aluno.turma)
  alunos: Alunos[];

  /**
   * Relacionamento com a entidade Professores.
   * Representa os professores associados à turma. Relacionamento ManyToMany.
   */
  @ManyToMany(() => Professor, (professor) => professor.turmas)
  professores: Professor[];
}
