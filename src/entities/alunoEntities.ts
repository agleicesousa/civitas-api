import { Entity, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Turma } from './turmasEntities';
import { Membros } from './membrosEntities';
import { Admin } from './adminEntities';

@Entity('alunos')
export class Aluno extends BaseEntity {
  /**
   * Relacionamento com a entidade `Membros`, representando o próprio aluno.
   * Um membro corresponde a um aluno.
   * @type {Membros}
   */
  @OneToOne(() => Membros, { eager: true })
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
   * Relacionamento ManyToOne com a entidade Membros (Admin).
   * Muitos alunos podem estar associados ao mesmo administrador.
   */
  @ManyToOne(() => Membros, { eager: true })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  /**
   * Relacionamento com a entidade `Turma`, indicando a turma à qual o aluno pertence.
   * @type {Turma}
   */
  @ManyToOne(() => Turma, (turma) => turma.alunos)
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;
}
