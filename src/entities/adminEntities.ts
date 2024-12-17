import { Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Turma } from './turmasEntities';
import { Professor } from './professorEntities';
import { Alunos } from './alunosEntities';

/**
 * Entidade principal para representar os administradores do sistema.
 * Relaciona-se com membros, turmas, professores e alunos.
 */
@Entity('admin')
export class Admin extends BaseEntity {
  /**
   * Relacionamento OneToOne com a entidade Membros.
   * A exclusão em cascata garante que se apagar um membro, o administrador associado também seja excluído.
   */
  @OneToOne(() => Membros, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  /**
   * Relacionamento OneToMany com as turmas administradas pelo administrador.
   */
  @OneToMany(() => Turma, (turma) => turma.admin)
  turmas: Turma[];

  /**
   * Relacionamento OneToMany com os professores sob a administração do administrador.
   */
  @OneToMany(() => Professor, (professor) => professor.admin)
  professores: Professor[];

  /**
   * Relacionamento OneToMany com os alunos sob a administração do administrador.
   */
  @OneToMany(() => Alunos, (aluno) => aluno.admin)
  alunos: Alunos[];
}
