import { Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Turma } from './turmasEntities';
import { Admin } from './adminEntities';

@Entity('alunos')
export class Alunos extends BaseEntity {
  @OneToOne(() => Membros, { eager: true })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  @ManyToOne(() => Admin, { eager: true, nullable: false })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @ManyToOne(() => Turma, (turma) => turma.alunos, { nullable: true })
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;
}