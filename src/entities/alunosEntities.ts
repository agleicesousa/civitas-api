import { Entity, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Turma } from './turmasEntities';
import { Admin } from './adminEntities';
import { PDI } from './pdiEntities';
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

  @OneToMany(() => PDI, (pdi) => pdi.aluno, {
    cascade: true
  })
  pdi: PDI[];
}
