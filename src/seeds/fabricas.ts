import { Faker, pt_BR } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Admin } from '../entities/adminEntities';
import { Alunos } from '../entities/alunosEntities';
import { TipoConta } from '../entities/baseEntity';
import { Membros } from '../entities/membrosEntities';
import { Professor } from '../entities/professorEntities';
import { Responsaveis } from '../entities/responsaveisEntities';
import {
  AnoLetivo,
  PeriodoLetivo,
  TipoEnsino,
  Turma
} from '../entities/turmasEntities';

const fakerBR = new Faker({
  locale: [pt_BR]
});

const turmaFabrica = setSeederFactory(Turma, () => {
  const turma = new Turma();
  turma.anoLetivo = fakerBR.helpers.arrayElement([
    AnoLetivo.ANO_1,
    AnoLetivo.ANO_2,
    AnoLetivo.ANO_3,
    AnoLetivo.ANO_4,
    AnoLetivo.ANO_5,
    AnoLetivo.ANO_6
  ]);

  turma.periodoLetivo = fakerBR.helpers.arrayElement([
    PeriodoLetivo.MANHA,
    PeriodoLetivo.TARDE,
    PeriodoLetivo.NOITE
  ]);

  turma.ensino = fakerBR.helpers.arrayElement([
    TipoEnsino.MATERNAL,
    TipoEnsino.PRE_ESCOLA,
    TipoEnsino.ENSINO_FUNDAMENTAL_1
  ]);

  const letraClasse = fakerBR.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']);
  turma.turmaApelido = `${turma.anoLetivo} ${letraClasse}`;

  return turma;
});

const membrosFabrica = setSeederFactory(Membros, () => {
  const membro = new Membros();
  membro.nomeCompleto = fakerBR.person.fullName();
  membro.numeroMatricula = fakerBR.number
    .int({ min: 1_000, max: 999_999 })
    .toString();
  membro.dataNascimento = fakerBR.date.birthdate();
  membro.rg = fakerBR.number
    .int({ min: 10_000_000_0, max: 99_999_999_9 })
    .toString();
  membro.cpf = fakerBR.number
    .int({ min: 100_000_000_00, max: 999_999_999_99 })
    .toString();
  membro.tipoConta = fakerBR.helpers.arrayElement([
    TipoConta.ADMIN,
    TipoConta.ALUNO,
    TipoConta.PROFESSOR,
    TipoConta.RESPONSAVEL
  ]);

  return membro;
});

const alunosFabrica = setSeederFactory(Alunos, () => {
  return new Alunos();
});

const responsaveisFabrica = setSeederFactory(Responsaveis, () => {
  return new Responsaveis();
});

const professorFabrica = setSeederFactory(Professor, () => {
  const professor = new Professor();
  professor.senha = '123123';

  return professor;
});

const adminFabrica = setSeederFactory(Admin, () => {
  const admin = new Admin();
  admin.email = fakerBR.internet.email();
  admin.senha = '123123';

  return admin;
});

export default [
  turmaFabrica,
  membrosFabrica,
  alunosFabrica,
  responsaveisFabrica,
  professorFabrica,
  adminFabrica
];
