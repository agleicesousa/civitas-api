import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinColumn
  } from 'typeorm';
  import { BaseEntity } from './baseEntity';
  import { Admin } from './adminEntities';
  import { Alunos } from './alunosEntities';
  import { Professor } from './professorEntities';
  
  export enum AnoLetivo {
    ANO_1 = '1º ano',
    ANO_2 = '2º ano',
    ANO_3 = '3º ano',
    ANO_4 = '4º ano',
    ANO_5 = '5º ano',
    ANO_6 = '6º ano'
  }
  
  export enum PeriodoLetivo {
    MANHA = 'Manhã',
    TARDE = 'Tarde',
    NOITE = 'Noite'
  }
  
  export enum TipoEnsino {
    MATERNAL = 'Maternal',
    PRE_ESCOLA = 'Pré-escola',
    ENSINO_FUNDAMENTAL_1 = 'Ensino fundamental 1'
  }
  
  @Entity('turmas')
  export class Turma extends BaseEntity {
    @Column({ type: 'enum', enum: AnoLetivo })
    anoLetivo: AnoLetivo;
  
    @Column({ type: 'enum', enum: PeriodoLetivo })
    periodoLetivo: PeriodoLetivo;
  
    @Column({ type: 'enum', enum: TipoEnsino })
    ensino: TipoEnsino;
  
    @Column({ type: 'varchar', length: 20 })
    turmaApelido: string;
  
    @ManyToOne(() => Admin, { eager: true, nullable: false })
    @JoinColumn({ name: 'adminId' })
    admin: Admin;
  
    @OneToMany(() => Alunos, (aluno) => aluno.turma)
    alunos: Alunos[];
  
    @ManyToMany(() => Professor, (professor) => professor.turmas)
    professores: Professor[];
  }