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

const tabelaDeDesempenho = {
  5: 'Exemplar',
  4: 'Engajado',
  3: 'Evoluindo',
  2: 'Atenção',
  1: 'Crítico'
};

@Entity('alunos')
export class Alunos extends BaseEntity {
  @OneToOne(() => Membros, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'membroId' })
  membro: Membros;

  @ManyToOne(() => Admin, { nullable: true })
  admin: Admin;

  @ManyToOne(() => Turma, (turma) => turma.alunos, { nullable: true })
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;

  @OneToMany(() => PDI, (pdi) => pdi.aluno, {
    cascade: true
  })
  pdi: PDI[];

  @Column({
    type: 'varchar',
    nullable: true
  })
  desempenho: string;

  calcularDesempenho(secoes: PdiSecao[]): string {
    const somaDesempenho = secoes.reduce(
      (soma, secao) => soma + Number(secao.media),
      0
    );
    const mediaDesempenho = Math.floor(somaDesempenho / secoes.length);
    // Garante que a chave fique dentro do intervalo de 1 a 5
    return tabelaDeDesempenho[Math.min(Math.max(mediaDesempenho, 1), 5)];
  }
}
