import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Admin } from './adminEntities';
import { Aluno } from './alunoEntities';
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
  @Column({
    type: 'enum',
    enum: AnoLetivo
  })
  anoLetivo: AnoLetivo;

  @Column({
    type: 'enum',
    enum: PeriodoLetivo
  })
  periodoLetivo: PeriodoLetivo;

  @Column({
    type: 'enum',
    enum: TipoEnsino
  })
  ensino: TipoEnsino;

  @Column({
    unique: true,
    type: 'varchar',
    length: 20
  })
  turmaApelido: string;

  @ManyToOne(() => Admin, { eager: true })
  admin: Admin;

  @OneToMany(() => Aluno, (aluno) => aluno.turma)
  alunos: Aluno[];

  @ManyToMany(() => Professor, (professor) => professor.turmas)
  professores: Professor[];
}
