import {
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';

export enum TipoConta {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  ALUNO = 'aluno'
}

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  dataAtualizacao: Date;

  @BeforeInsert()
  setDataCriacao(): void {
    this.dataCriacao = new Date();
  }

  @BeforeUpdate()
  setDataAtualizacao(): void {
    this.dataAtualizacao = new Date();
  }
}
