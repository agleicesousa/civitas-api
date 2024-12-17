import {
  Entity,
  ManyToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Turma } from './turmasEntities';
import { Admin } from './adminEntities';
import { PDI } from './pdiEntities';

/**
 * Entidade principal para representar os professores no sistema.
 * Relaciona-se com membros, turmas, administradores e PDI (Plano de Desenvolvimento Individual).
 */
@Entity('professores')
export class Professor extends BaseEntity {
  /**
   * Relacionamento OneToOne com a entidade Membros.
   * Representa os dados do membro associado ao professor.
   * Exclusão em cascata é configurada para garantir integridade referencial.
   */
  @OneToOne(() => Membros, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  /**
   * Relacionamento ManyToMany com a entidade Turma.
   * Representa as turmas que o professor leciona.
   * Utiliza a tabela associativa 'professoresTurmas'.
   */
  @ManyToMany(() => Turma, { eager: true })
  @JoinTable({
    name: 'professoresTurmas',
    joinColumn: { name: 'professorId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'turmaId', referencedColumnName: 'id' }
  })
  turmas: Turma[];

  /**
   * Relacionamento ManyToOne com a entidade Admin.
   * Representa o administrador responsável pelo professor.
   */
  @ManyToOne(() => Admin, { eager: true, nullable: true })
  admin: Admin;

  /**
   * Relacionamento OneToMany com a entidade PDI (Plano de Desenvolvimento Individual).
   * Representa os PDIs associados ao professor.
   */
  @OneToMany(() => PDI, (pdi) => pdi.professor)
  pdi: PDI[];
}
