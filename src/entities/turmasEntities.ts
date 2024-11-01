import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Admin } from './adminEntities';
import { Alunos } from './alunosEntities';
import { Professor } from './professorEntities';
/**
 * Enum para representar os anos letivos disponíveis.
 * @enum {string}
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
 * Enum para representar os periodos letivos disponíveis.
 * @enum {string}
 */
export enum PeriodoLetivo {
  MANHA = 'Manhã',
  TARDE = 'Tarde',
  NOITE = 'Noite'
}
/**
 * Enum para representar os tipos de ensino.
 * @enum {string}
 */
export enum TipoEnsino {
  MATERNAL = 'Maternal',
  PRE_ESCOLA = 'Pré-escola',
  ENSINO_FUNDAMENTAL_1 = 'Ensino fundamental 1'
}

@Entity('turmas')
export class Turma extends BaseEntity {
  /**
   * Ano letivo da turma, representado pelo enum `AnoLetivo`.
   * Define o ano escolar da turma.
   * @type {AnoLetivo}
   */
  @Column({
    type: 'enum',
    enum: AnoLetivo
  })
  anoLetivo: AnoLetivo;

  /**
   * Período letivo da turma, representado pelo enum `PeriodoLetivo`.
   * Especifica o turno da turma (manhã, tarde, ou noite).
   * @type {PeriodoLetivo}
   */
  @Column({
    type: 'enum',
    enum: PeriodoLetivo
  })
  periodoLetivo: PeriodoLetivo;

  /**
   * Tipo de ensino da turma, representado pelo enum `TipoEnsino`.
   * Determina o nível de ensino oferecido pela turma.
   * @type {TipoEnsino}
   */
  @Column({
    type: 'enum',
    enum: TipoEnsino
  })
  ensino: TipoEnsino;

  /**
   * Apelido ou código único da turma.
   * Usado para identificar a turma de maneira simplificada.
   * @type {string}
   */
  @Column({
    unique: true,
    type: 'varchar',
    length: 20
  })
  turmaApelido: string;

  /**
   * Relacionamento ManyToOne com a entidade `Admin`.
   * Cada turma está associada a um administrador responsável.
   * @type {Admin}
   */
  @ManyToOne(() => Admin, { eager: true })
  admin: Admin;

  /**
   * Relacionamento OneToMany com a entidade `Alunos`.
   * Uma turma pode ter vários alunos associados.
   * @type {Alunos[]}
   */
  @OneToMany(() => Alunos, (aluno) => aluno.turma)
  alunos: Alunos[];

  /**
   * Relacionamento ManyToMany com a entidade `Professor`.
   * Uma turma pode ter vários professores associados, e um professor pode estar em várias turmas.
   * @type {Professor[]}
   */
  @ManyToMany(() => Professor, (professor) => professor.turmas)
  professores: Professor[];
}
