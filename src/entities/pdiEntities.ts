import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Alunos } from './alunosEntities';
import { Professor } from './professorEntities';

/**
 * Enum representando os níveis de satisfação no sistema.
 */
export enum NivelDeSatisfacao {
  MUITO_SATISFEITO = 5,
  SATISFEITO = 4,
  NEUTRO = 3,
  INSATISFEITO = 2,
  MUITO_INSATISFEITO = 1
}

/**
 * Entidade principal do PDI (Plano de Desenvolvimento Individual).
 * Relaciona-se com `Alunos` e `Professores`, e contém seções e considerações.
 */
@Entity('pdis')
export class PDI extends BaseEntity {
  /**
   * Relacionamento com a entidade Alunos.
   */
  @ManyToOne(() => Alunos, (aluno) => aluno.pdi)
  @JoinColumn({ name: 'alunoId' })
  aluno: Alunos;

  /**
   * Relacionamento com a entidade Professores.
   */
  @ManyToOne(() => Professor, (professor) => professor.pdi)
  @JoinColumn({ name: 'professorId' })
  professor: Professor;

  /** Campo para armazenar considerações sobre o PDI. */
  @Column({ type: 'varchar', nullable: true, length: 500 })
  consideracoes: string | null;

  /**
   * Relacionamento com as seções do PDI.
   * Configurado para cascata de operações e carregamento antecipado.
   */
  @OneToMany(() => PdiSecao, (secao) => secao.pdi, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'pdiSecao' })
  secoes: PdiSecao[];
}

/**
 * Entidade representando uma seção dentro do PDI.
 * Contém respostas, média de avaliações e relacionamentos com a entidade PDI.
 */
@Entity('pdiSecao')
export class PdiSecao extends BaseEntity {
  /** Título da seção do PDI. */
  @Column()
  titulo: string;

  /**
   * Relacionamento com as respostas da seção.
   * Configurado para cascata de operações e carregamento antecipado.
   */
  @OneToMany(() => PdiResposta, (resposta) => resposta.secao, {
    cascade: true,
    eager: true
  })
  @JoinColumn({ name: 'pdiRespostas' })
  respostas: PdiResposta[];

  /**
   * Relacionamento com o PDI principal.
   * Exclusão em cascata configurada.
   */
  @ManyToOne(() => PDI, (pdi) => pdi.secoes, {
    onDelete: 'CASCADE'
  })
  pdi: PDI;

  /** Média calculada da seção baseada nas respostas. */
  @Column('decimal', { precision: 5, scale: 2 })
  media: number;

  /**
   * Calcula automaticamente a média das respostas da seção.
   * Executado antes da inserção e atualização da seção.
   */
  @BeforeUpdate()
  @BeforeInsert()
  calcularMedia() {
    if (this.respostas && this.respostas.length > 0) {
      const soma = this.respostas.reduce((acc, resp) => acc + resp.valor, 0);
      this.media = Number((soma / this.respostas.length).toFixed(2));
    }
  }
}

/**
 * Entidade representando as respostas relacionadas às seções do PDI.
 * Contém dados da pergunta e nível de satisfação. Relaciona-se com a seção correspondente.
 */
@Entity('pdiRespostas')
export class PdiResposta extends BaseEntity {
  /** Pergunta relacionada à resposta. */
  @Column()
  pergunta: string;

  /** Valor da resposta baseado no nível de satisfação. */
  @Column({ type: 'enum', enum: NivelDeSatisfacao })
  valor: NivelDeSatisfacao;

  /**
   * Relacionamento com a seção correspondente do PDI.
   * Exclusão em cascata configurada.
   */
  @ManyToOne(() => PdiSecao, (secao) => secao.respostas, {
    onDelete: 'CASCADE'
  })
  secao: PdiSecao;
}
