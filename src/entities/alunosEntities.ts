import { Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Responsaveis } from './responsaveisEntities';

/**
 * Entidade que representa um Aluno no sistema.
 * Um aluno está associado a um membro (OneToOne),
 * um admin (ManyToOne), e um responsável (ManyToOne).
 */
@Entity('alunos')
export class Alunos extends BaseEntity {
  /**
   * Relacionamento OneToOne com a entidade Membros.
   * Cada aluno tem um membro associado que armazena suas informações gerais.
   */
  @OneToOne(() => Membros, { eager: true })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  /**
   * Relacionamento ManyToOne com a entidade Membros (Admin).
   * Muitos alunos podem estar associados ao mesmo administrador.
   */
  @ManyToOne(() => Membros, { eager: true })
  @JoinColumn({ name: 'adminId' })
  admin: Membros;

  /**
   * Relacionamento ManyToOne com a entidade Responsaveis.
   * Cada aluno tem exatamente um responsável.
   */
  @ManyToOne(() => Responsaveis, (responsavel) => responsavel.alunos)
  @JoinColumn({ name: 'responsavelId' })
  responsavel: Responsaveis;
}
