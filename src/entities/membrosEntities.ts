import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseEntity, TipoConta } from './baseEntity';
import { criptografarSenha } from '../utils/senhaUtils';

@Entity('membros')
export class Membros extends BaseEntity {
  /**
   * Número de matrícula único associado ao membro.
   * @type {string}
   * @unique
   */
  @Column({ unique: true, nullable: true })
  numeroMatricula: string;

  /**
   * Email único do membro.
   * @type {string}
   */
  @Column({ nullable: true, unique: true })
  email: string;

  /**
   * Senha do membro, armazena de forma criptografada.
   * @type {string}
   */
  @Column({ nullable: true, unique: true })
  senha: string;

  /**
   * Nome completo do membro.
   * @type {string}
   */
  @Column({ nullable: true })
  nomeCompleto: string;

  /**
   * Data de nascimento do membro.
   * @type {Date}
   */
  @Column({ nullable: true })
  dataNascimento: Date;

  /**
   * Número do RG (Registro Geral) do membro.
   * O RG deve ser único no banco de dados.
   * @type {string}
   * @unique
   */
  @Column({ unique: true, nullable: true })
  rg: string;

  /**
   * Número do CPF (Cadastro de Pessoa Física) do membro.
   * O CPF deve ser único no banco de dados.
   * @type {string}
   * @unique
   */
  @Column({ unique: true, nullable: true })
  cpf: string;

  /**
   * Tipo de conta do membro, que pode ser um dos valores definidos no enum `TipoConta`.
   * @type {TipoConta}
   */
  @Column({ type: 'enum', enum: TipoConta })
  tipoConta: TipoConta;

  /**
   * Antes de atualizar ou inserir um novo membro, cripgrafa a senha.
   */
  @BeforeInsert()
  @BeforeUpdate()
  async handleCriptografiaSenha(): Promise<void> {
    if (this.senha && this.isSenhaPlanText()) {
      this.senha = await criptografarSenha(this.senha);
    }
  }

  /**
   * Verifica se a senha está em formato de texto puro.
   * @return {boolean} true se a senha estiver em texto puro, false se caso contrário.
   */
  private isSenhaPlanText(): boolean {
    return this.senha.startsWith('$2b$');
  }
}
