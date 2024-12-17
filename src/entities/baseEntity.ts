import {
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';

/**
 * Enum representando os tipos de conta no sistema.
 */
export enum TipoConta {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  ALUNO = 'aluno'
}

/**
 * Classe base para todas as entidades com campos comuns como `id`, `dataCriacao` e `dataAtualizacao`.
 * Inclui hooks para atualizar automaticamente as datas de criação e atualização.
 */
export abstract class BaseEntity {
  /** Identificador único gerado automaticamente para cada entidade. */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Data de criação da entidade.
   * Configurada automaticamente no momento da criação.
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  /**
   * Data de última atualização da entidade.
   * Atualizada automaticamente sempre que houver uma modificação.
   */
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  dataAtualizacao: Date;

  /**
   * Hook executado antes da inserção de um registro no banco de dados.
   * Configura o campo `dataCriacao` com a data atual.
   */
  @BeforeInsert()
  setDataCriacao(): void {
    this.dataCriacao = new Date();
  }

  /**
   * Hook executado antes da atualização de um registro no banco de dados.
   * Configura o campo `dataAtualizacao` com a data atual.
   */
  @BeforeUpdate()
  setDataAtualizacao(): void {
    this.dataAtualizacao = new Date();
  }
}
