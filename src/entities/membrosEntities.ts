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
import { criptografarSenha } from '../utils/senhaUtils';

@Entity('membros')
export class Membros extends BaseEntity {
  @ManyToOne(() => Admin, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'adminCriadorId' })
  adminCriadorId: Admin;

  @OneToOne(() => Admin, { nullable: true, onDelete: 'CASCADE' })
  admin: Admin;

  @Column({ unique: true, nullable: false })
  numeroMatricula: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  senha: string;

  @Column({ nullable: false })
  nomeCompleto: string;

  @Column({ type: 'enum', enum: TipoConta, nullable: false })
  tipoConta: TipoConta;

  @BeforeInsert()
  @BeforeUpdate()
  async handleCriptografiaSenha(): Promise<void> {
    if (this.senha && this.isSenhaPlanText()) {
      this.senha = await criptografarSenha(this.senha);
    }
  }

  private isSenhaPlanText(): boolean {
    return !this.senha.startsWith('$2b$');
  }
}
