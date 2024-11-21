import {
  Entity,
  ManyToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Turma } from './turmasEntities';
import { Admin } from './adminEntities';

@Entity('professores')
export class Professor extends BaseEntity {
  /**
   * Representa a associação do professor com um membro.
   * Permite incluir dados pessoais.
   */
  @OneToOne(() => Membros, { eager: true })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  /**
   * Representa a relação entre o professor e as turmas que ele ensina.
   * Permite atribuir múltiplas turmas a um professor.
   */
  @ManyToMany(() => Turma, { eager: true })
  @JoinTable({
    name: 'professoresTurma',
    joinColumn: {
      name: 'professorId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'turmaId',
      referencedColumnName: 'id'
    }
  })
  turmas: Turma[];

  @ManyToOne(() => Admin, { eager: true })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}
