import { Entity, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Turma } from './turmasEntities';
import { Membros } from './membrosEntities';

@Entity('alunos')
export class Aluno extends BaseEntity {
  /**
   * Relacionamento com a entidade `Membros`, representando o próprio aluno.
   * Um membro corresponde a um aluno.
   * @type {Membros}
   */
  @OneToOne(() => Membros)
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  /**
   * Relacionamento com a entidade `Membros`, representando o responsável pelo aluno.
   * @type {Membros}
   */
  @ManyToOne(() => Membros, { eager: true })
  @JoinColumn({ name: 'responsavelId' })
  responsavel: Membros;

  /**
   * Relacionamento com a entidade `Turma`, indicando a turma à qual o aluno pertence.
   * @type {Turma}
   */
  @ManyToOne(() => Turma, { eager: true })
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;
}
