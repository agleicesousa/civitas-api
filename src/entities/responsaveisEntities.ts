import { Entity, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Alunos } from './alunosEntities';

@Entity()
export class Responsaveis extends BaseEntity {
  /**
   * Relacionamento OneToOne com a entidade Membros.
   * Cada responsável tem um membro associado que armazena suas informações gerais.
   */
  @OneToOne(() => Membros, { eager: true })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  /**
   * Relacionamento ManyToOne com a entidade Membros (Admin).
   * Muitos responsáveis podem estar associados ao mesmo administrador.
   */
  @ManyToOne(() => Membros, { eager: true })
  @JoinColumn({ name: 'adminId' })
  admin: Membros;

  /**
   * Relacionamento OneToMany com a entidade Alunos.
   * Um responsável pode ser responsável por vários alunos.
   */
  @OneToMany(() => Alunos, (alunos) => alunos.responsavel)
  alunos: Alunos[];
}
