import 'dotenv/config';
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
  Turma,
} from '../entities/turmasEntities';

const fakerBR = new Faker({ locale: [pt_BR] });

/**
 * Fábrica para gerar dados de Membros.
 */
const membrosFabrica = setSeederFactory(Membros, () => {
  const membro = new Membros();
  membro.email = fakerBR.internet.email();
  membro.senha = process.env.MEMBRO_PASSWORD;
  membro.nomeCompleto = fakerBR.person.fullName();
  membro.numeroMatricula = fakerBR.number.int({ min: 1000, max: 999999 }).toString();
  membro.dataNascimento = fakerBR.date.birthdate();
  membro.rg = fakerBR.number.int({ min: 100000000, max: 999999999 }).toString();
  membro.cpf = fakerBR.number.int({ min: 10000000000, max: 99999999999 }).toString();
  membro.tipoConta = fakerBR.helpers.arrayElement([
    TipoConta.ADMIN,
    TipoConta.ALUNO,
    TipoConta.PROFESSOR,
    TipoConta.RESPONSAVEL,
  ]);
  return membro;
});

/**
 * Fábrica para gerar dados de Alunos.
 */
const alunosFabrica = setSeederFactory(Alunos, () => {
  const aluno = new Alunos();
  aluno.membro = new Membros();
  return aluno;
});

/**
 * Fábrica para gerar dados de Responsáveis.
 */
const responsaveisFabrica = setSeederFactory(Responsaveis, () => {
  const responsavel = new Responsaveis();
  responsavel.membro = new Membros();
  return responsavel;
});

/**
 * Fábrica para gerar dados de Professores.
 */
const professorFabrica = setSeederFactory(Professor, () => {
  const professor = new Professor();
  professor.membro = new Membros();
  return professor;
});

/**
 * Fábrica para gerar dados de Administradores.
 */
const adminFabrica = setSeederFactory(Admin, () => {
  const admin = new Admin();
  admin.membro = new Membros();
  return admin;
});

/**
 * Fábrica para gerar dados de Turmas.
 */
const turmaFabrica = setSeederFactory(Turma, () => {
  const turma = new Turma();
  turma.anoLetivo = fakerBR.helpers.arrayElement([
    AnoLetivo.ANO_1,
    AnoLetivo.ANO_2,
    AnoLetivo.ANO_3,
    AnoLetivo.ANO_4,
    AnoLetivo.ANO_5,
    AnoLetivo.ANO_6,
  ]);
  turma.periodoLetivo = fakerBR.helpers.arrayElement([
    PeriodoLetivo.MANHA,
    PeriodoLetivo.TARDE,
    PeriodoLetivo.NOITE,
  ]);
  turma.ensino = fakerBR.helpers.arrayElement([
    TipoEnsino.MATERNAL,
    TipoEnsino.PRE_ESCOLA,
    TipoEnsino.ENSINO_FUNDAMENTAL_1,
  ]);
  const letraClasse = fakerBR.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']);
  turma.turmaApelido = `${turma.anoLetivo} ${letraClasse}`;
  return turma;
});

/**
 * Exporta todas as fábricas de dados.
 */
export default [
  turmaFabrica,
  membrosFabrica,
  alunosFabrica,
  responsaveisFabrica,
  professorFabrica,
  adminFabrica,
];