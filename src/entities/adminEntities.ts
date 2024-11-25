import { Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Turma } from './turmasEntities';
import { Professor } from './professorEntities';
import { Alunos } from './alunosEntities';

@Entity('admin')
export class Admin extends BaseEntity {
  @OneToOne(() => Membros, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  @OneToMany(() => Turma, (turma) => turma.admin)
  turmas: Turma[];

  @OneToMany(() => Professor, (professor) => professor.admin)
  professores: Professor[];

  @OneToMany(() => Alunos, (aluno) => aluno.admin)
  alunos: Alunos[];
}
