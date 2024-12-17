import {
  Entity,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Membros } from './membrosEntities';
import { Turma } from './turmasEntities';
import { Admin } from './adminEntities';
import { PDI, PdiSecao } from './pdiEntities';

// Mapeamento de desempenho para valores numéricos.
const tabelaDeDesempenho = {
  5: 'Exemplar',
  4: 'Engajado',
  3: 'Evoluindo',
  2: 'Atenção',
  1: 'Crítico'
};

/**
 * Representa os dados e relacionamentos dos alunos no sistema.
 * Relaciona-se com membros, administradores, turmas e PDIs (Planos de Desenvolvimento Individual).
 */
@Entity('alunos')
export class Alunos extends BaseEntity {
  /**
   * Relacionamento OneToOne com a entidade Membros.
   * Exclusão em cascata configurada para garantir integridade referencial.
   */
  @OneToOne(() => Membros, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  /**
   * Relacionamento ManyToOne com a entidade Admin.
   * Representa o administrador responsável pelo aluno.
   */
  @ManyToOne(() => Admin, { nullable: true })
  admin: Admin;

  /**
   * Relacionamento ManyToOne com a entidade Turma.
   * Representa a turma do aluno.
   */
  @ManyToOne(() => Turma, (turma) => turma.alunos, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;

  /**
   * Relacionamento OneToMany com a entidade PDI.
   * Representa os PDIs associados ao aluno.
   */
  @OneToMany(() => PDI, (pdi) => pdi.aluno, {
    cascade: true
  })
  pdi: PDI[];

  /**
   * Campo para armazenar o desempenho do aluno.
   */
  @Column({
    type: 'varchar',
    nullable: true
  })
  desempenho: string;

  /**
   * Calcula o desempenho do aluno com base nas seções do PDI.
   * Converte a média numérica das seções para a representação qualitativa usando a tabela `tabelaDeDesempenho`.
   *
   * @param secoes - Lista de seções do PDI usadas para o cálculo.
   * @returns Desempenho qualitativo baseado na tabela definida.
   */
  calcularDesempenho(secoes: PdiSecao[]): string {
    const somaDesempenho = secoes.reduce(
      (soma, secao) => soma + Number(secao.media),
      0
    );
    const mediaDesempenho = Math.floor(somaDesempenho / secoes.length);

    // Garante que a chave fique dentro do intervalo de 1 a 5.
    return tabelaDeDesempenho[Math.min(Math.max(mediaDesempenho, 1), 5)];
  }
}
