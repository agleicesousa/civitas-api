import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { BaseEntity, TipoConta } from "./baseEntity";
import { Admin } from "./adminEntities";
import { Professor } from "./professorEntities";
import { criptografarSenha } from "../utils/senhaUtils";

@Entity("membros")
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

  @Column({ type: "enum", enum: TipoConta, nullable: false })
  tipoConta: TipoConta;

  @ManyToOne(() => Admin, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "adminCriadorId" })
  adminCriadorId: Admin;

  @OneToOne(() => Professor, {
    nullable: true,
    onDelete: "CASCADE",
  })
  professor: Professor;

  @OneToOne(() => Admin, {
    nullable: true,
    onDelete: "CASCADE",
  })
  admin: Admin;

  @BeforeInsert()
  @BeforeUpdate()
  async handleCriptografiaSenha(): Promise<void> {
    if (this.senha && this.isSenhaPlanText()) {
      this.senha = await criptografarSenha(this.senha);
    }
  }

  private isSenhaPlanText(): boolean {
    return !this.senha.startsWith("$2b$");
  }
}
