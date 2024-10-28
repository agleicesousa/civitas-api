import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Turma } from './turmasEntities';
import { criptografarSenha } from '../utils/senhaUtils';

@Entity()
export class Admin extends BaseEntity {
  /**
   * Relacionamento com a entidade `Membros`, indicando que um administrador é também um membro.
   * @type {Membros}
   */
  @OneToOne(() => Membros, { eager: true })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  /**
   * Apelido único do administrador.
   * @type {string}
   */
  @Column({ unique: true })
  apelido: string;

  /**
   * E-mail único do administrador.
   * @type {string}
   */
  @Column({ unique: true })
  email: string;

  /**
   * Senha do administrador, armazenada de forma criptografada.
   * @type {string}
   */
  @Column()
  senha: string;

   /**
   * Relação com as turmas gerenciadas pelo administrador.
   * Esta propriedade representa todas as turmas associadas a este administrador.
   * 
   * @type {Turma[]}
   */
  @OneToMany(() => Turma, (turma) => turma.admin)
  turmas: Turma[];

  @BeforeInsert()
  @BeforeUpdate()

  /**
   * Antes de inserir ou atualizar um registro de administrador, criptografa a senha.
   */
  @BeforeInsert()
  @BeforeUpdate()
  async handleCriptografiaSenha(): Promise<void> {
    if (this.senha && this.isSenhaPlainText()) {
      this.senha = await criptografarSenha(this.senha);
    }
  }

  /**
   * Verifica se a senha está em formato de texto puro.
   * @returns {boolean} true se a senha estiver em texto puro, false caso contrário.
   */
  private isSenhaPlainText(): boolean {
    return !this.senha.startsWith('$2b$'); // Hash bcrypt começa com $2b$
  }
}
