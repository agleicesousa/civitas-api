import {
  Entity,
  ManyToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToOne
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Turma } from './turmasEntities';
import { Admin } from './adminEntities';

@Entity('professores')
export class Professor extends BaseEntity {
  @OneToOne(() => Membros, { eager: true })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  @ManyToMany(() => Turma, { eager: true })
  @JoinTable({
    name: 'professoresTurmas',
    joinColumn: { name: 'professorId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'turmaId', referencedColumnName: 'id' }
  })
  turmas: Turma[];

  @ManyToOne(() => Admin, { eager: true, nullable: true })
  admin: Admin;
}
