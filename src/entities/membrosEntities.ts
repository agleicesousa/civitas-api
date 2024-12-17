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

/**
 * Representa a entidade principal para os membros do sistema, como administradores, professores e alunos.
 * Estende a classe base `BaseEntity` para herdar campos comuns.
 */
@Entity('membros')
export class Membros extends BaseEntity {
  /** Número de matrícula único para identificação do membro. */
  @Column({ unique: true, nullable: true })
  numeroMatricula: string;

  /** Endereço de e-mail do membro. */
  @Column({ nullable: false })
  email: string;

  /** Senha do membro, que será criptografada antes de ser armazenada. */
  @Column({ nullable: true })
  senha: string;

  /** Nome completo do membro. */
  @Column({ nullable: true })
  nomeCompleto: string;

  /** CPF do membro. */
  @Column({ nullable: true })
  cpf: string;

  /** Tipo da conta associada ao membro (admin, professor, aluno). */
  @Column({ type: 'enum', enum: TipoConta, nullable: false })
  tipoConta: TipoConta;

  /** Indica se é o primeiro login do membro no sistema. */
  @Column({ default: true })
  primeiroLogin: boolean;

  /** ID do administrador que criou o registro. */
  @Column({ nullable: true })
  adminCriadorId: number;

  /** Token de reset de senha para recuperação de conta. */
  @Column({ nullable: true })
  resetToken: string;

  /** Expiração do token para redefinição de senha. */
  @Column({ type: 'timestamp', nullable: true })
  resetTokenExp: Date;

  /**
   * Relacionamento com a entidade `Admin`.
   * Define quem criou o membro no sistema. Configurado para permitir exclusão com 'SET NULL'.
   */
  @ManyToOne(() => Admin, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'adminCriadorId' })
  adminCriador: Admin;

  /**
   * Relacionamento com a entidade `Professor`.
   * Exclusão em cascata caso o registro seja removido.
   */
  @OneToOne(() => Professor, { nullable: true, onDelete: 'CASCADE' })
  professor: Professor;

  /**
   * Relacionamento com a entidade `Alunos`.
   * Exclusão em cascata caso o registro seja removido.
   */
  @OneToOne(() => Alunos, { nullable: true, onDelete: 'CASCADE' })
  aluno: Alunos;

  /**
   * Hook para criptografar a senha antes de salvar no banco de dados.
   * Executado tanto na inserção quanto na atualização da entidade.
   */
  @BeforeInsert()
  @BeforeUpdate()
  async handleCriptografiaSenha(): Promise<void> {
    if (this.senha && !this.senha.startsWith('$2b$')) {
      this.senha = await criptografarSenha(this.senha);
    }
  }
}
