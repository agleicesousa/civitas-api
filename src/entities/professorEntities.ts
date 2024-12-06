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
@Entity('professores')
export class Professor extends BaseEntity {
  @OneToOne(() => Membros, { eager: true, onDelete: 'CASCADE' })
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

  @OneToMany(() => PDI, (pdi) => pdi.professor)
  pdi: PDI[];
}
