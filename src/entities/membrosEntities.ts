import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, TipoConta } from './baseEntity';
import { Admin } from './adminEntities';

@Entity('membros')
export class Membros extends BaseEntity {
  @Column({ unique: true, nullable: true })
  numeroMatricula: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  senha: string;

  @Column({ nullable: true })
  nomeCompleto: string;

  @Column({ type: 'date', nullable: true })
  dataNascimento: Date;

  @Column({ unique: true, nullable: true })
  rg: string;

  @Column({ unique: true, nullable: true })
  cpf: string;

  @Column({ type: 'enum', enum: TipoConta })
  tipoConta: TipoConta;

  @ManyToOne(() => Admin, { eager: true, nullable: false })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}
