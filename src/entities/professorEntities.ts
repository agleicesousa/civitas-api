import { Entity, ManyToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
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
  turmas: Turma[];

  @ManyToOne(() => Admin, { eager: true, nullable: false })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}