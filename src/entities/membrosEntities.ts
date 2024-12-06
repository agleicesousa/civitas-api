import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { BaseEntity, TipoConta } from './baseEntity';
import { Admin } from './adminEntities';
import { Professor } from './professorEntities';
import { Alunos } from './alunosEntities';
import { criptografarSenha } from '../utils/validarSenhaUtils';

@Entity('membros')
export class Membros extends BaseEntity {
  @Column({ unique: true, nullable: true })
  numeroMatricula: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  senha: string;

  @Column({ nullable: true })
  nomeCompleto: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ type: 'enum', enum: TipoConta, nullable: false })
  tipoConta: TipoConta;

  @Column({ nullable: true })
  adminCriadorId: number;

  @ManyToOne(() => Admin, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'adminCriadorId' })
  adminCriador: Admin;

  @OneToOne(() => Professor, { nullable: true, onDelete: 'CASCADE' })
  professor: Professor;

  @OneToOne(() => Alunos, { nullable: true, onDelete: 'CASCADE' })
  aluno: Alunos;

  @BeforeInsert()
  @BeforeUpdate()
  async handleCriptografiaSenha(): Promise<void> {
    if (this.senha && !this.senha.startsWith('$2b$')) {
      this.senha = await criptografarSenha(this.senha);
    }
  }
}
