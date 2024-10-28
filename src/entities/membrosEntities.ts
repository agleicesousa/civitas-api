import { Entity, Column } from 'typeorm';
import { BaseEntity, TipoConta } from './baseEntity';

@Entity()
export class Membros extends BaseEntity {
  /**
   * Número de matrícula único associado ao membro.
   * @type {string}
   * @unique
   */
  @Column({ unique: true })
  numeroMatricula: string;

  /**
   * Nome completo do membro.
   * @type {string}
   */
  @Column()
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
}
