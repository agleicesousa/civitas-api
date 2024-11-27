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

export enum NivelDeSatisfacao {
  MUITO_SATISFEITO = 5,
  SATISFEITO = 4,
  NEUTRO = 3,
  INSATISFEITO = 2,
  MUITO_INSATISFEITO = 1
}

@Entity('pdis')
export class PDI extends BaseEntity {
  @ManyToOne(() => Alunos, (aluno) => aluno.pdi)
  @JoinColumn({ name: 'alunoId' })
  aluno: Alunos;

  @Column({ type: 'text', nullable: true })
  consideracoes: string | null;

  @OneToMany(() => PdiSecao, (secao) => secao.pdi, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE'
  })
  secoes: PdiSecao[];
}

@Entity()
export class PdiSecao extends BaseEntity {
  @Column()
  titulo: string;

  @OneToMany(() => PdiResposta, (resposta) => resposta.secao, {
    cascade: true,
    eager: true
  })
  respostas: PdiResposta[];

  @ManyToOne(() => PDI, (pdi) => pdi.secoes, {
    onDelete: 'CASCADE'
  })
  pdi: PDI;

  @Column('decimal', { precision: 5, scale: 2 })
  media: number;

  // Calcula média da seção do PDI automaticamente após adição/edição;
  @BeforeUpdate()
  @BeforeInsert()
  calcularMedia() {
    if (this.respostas && this.respostas.length > 0) {
      const soma = this.respostas.reduce((acc, resp) => acc + resp.valor, 0);
      this.media = Number((soma / this.respostas.length).toFixed(2));
    }
  }
}

@Entity('respostas')
export class PdiResposta extends BaseEntity {
  @Column()
  pergunta: string;

  @Column({ type: 'enum', enum: NivelDeSatisfacao })
  valor: NivelDeSatisfacao;

  @ManyToOne(() => PdiSecao, (secao) => secao.respostas, {
    onDelete: 'CASCADE'
  })
  secao: PdiSecao;
}
