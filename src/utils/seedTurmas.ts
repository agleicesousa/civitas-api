// import {
//   AnoLetivo,
//   PeriodoLetivo,
//   TipoEnsino
// } from '../entities/turmasEntities';
// import { TipoConta } from '../entities/baseEntity';
// import { MembrosService } from '../services/membrosService';
// import { AdminService } from '../services/adminService';
// import TurmasService from '../services/turmasService';

// async function criarMembroAdmin() {
//   try {
//     const membrosService = new MembrosService();
//     const adminServices = new AdminService();
//     const membroDados = {
//       numeroMatricula: '202400155576',
//       nomeCompleto: 'Fulano Admin da silva',
//       dataNascimento: new Date('1990-05-15'),
//       rg: '12.345.124-6',
//       cpf: '123.453.124-10',
//       tipoConta: TipoConta.ADMIN
//     };
//     const membro = await membrosService.criarMembro(membroDados);
//     const apelido = 'AdminFulano2233';
//     const senha = 'senhaSimples2233';
//     const membroId = membro.id;
//     const email = 'fulano.admin2233@gmail.com';

//     const admin = await adminServices.criarAdmin(
//       apelido,
//       email,
//       senha,
//       membroId
//     );
//     return admin;
//   } catch (error) {
//     console.error('Erro ao criar membro:', error);
//     throw error;
//   }
// }

// export async function inserirTurmarIniciais() {
//   console.log('Iniciando inserção de turmas...');
//   const admin = await criarMembroAdmin();
//   console.log('Admin criado:', admin);

//   try {
//     const [turma1, turma2] = await Promise.all([
//       TurmasService.criar({
//         anoLetivo: AnoLetivo.ANO_5,
//         periodoLetivo: PeriodoLetivo.TARDE,
//         ensino: TipoEnsino.ENSINO_FUNDAMENTAL_1,
//         turmaApelido: '5º ano A',
//         admin: admin
//       }),
//       TurmasService.criar({
//         anoLetivo: AnoLetivo.ANO_4,
//         periodoLetivo: PeriodoLetivo.MANHA,
//         ensino: TipoEnsino.ENSINO_FUNDAMENTAL_1,
//         turmaApelido: '4º ano B',
//         admin: admin
//       })
//     ]);

//     console.log('Turmas criadas:', turma1, turma2);
//   } catch (error) {
//     console.error('Erro ao criar turmas:', error);
//   }
// }
