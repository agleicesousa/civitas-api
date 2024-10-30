import { criptografarSenha } from '../utils/senhaUtils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  AnoLetivo,
  PeriodoLetivo,
  TipoEnsino
} from '../entities/turmasEntities';
import { TipoConta } from '../entities/baseEntity';

export class Migrations1730153594068 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const membroResult = await queryRunner.query(`
            INSERT INTO membros (
                numeroMatricula,
                nomeCompleto,
                dataNascimento,
                rg,
                cpf,
                tipoConta,
                dataCriacao,
                dataAtualizacao
            ) VALUES (
                '12345678',
                'Admin Principal',
                '1990-05-15',
                '12.345.124-6',
                '123.453.124-10',
                '${TipoConta.ADMIN}',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
        `);

    const membroId = membroResult.insertId;

    const hashedPassword = await criptografarSenha(process.env.ADMIN_PASSWORD);

    const adminResult = await queryRunner.query(`
            INSERT INTO admin (
                email,
                senha,
                membroId,
                dataCriacao,
                dataAtualizacao
            ) VALUES (
                'admin.principal12310@gmail.com',
                '${hashedPassword}',
                ${membroId},
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
        `);

    const adminId = adminResult.insertId;

    await queryRunner.query(`
            INSERT INTO turmas (
                anoLetivo,
                periodoLetivo,
                ensino,
                turmaApelido,
                adminId,
                dataCriacao,
                dataAtualizacao
            ) VALUES 
            (
                '${AnoLetivo.ANO_5}',
                '${PeriodoLetivo.TARDE}',
                '${TipoEnsino.ENSINO_FUNDAMENTAL_1}',
                '5º ano A',
                ${adminId},
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ),
            (
                '${AnoLetivo.ANO_4}',
                '${PeriodoLetivo.MANHA}',
                '${TipoEnsino.ENSINO_FUNDAMENTAL_1}',
                '4º ano B',
                ${adminId},
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM turmas`);
    await queryRunner.query(`DELETE FROM admin`);
    await queryRunner.query(`DELETE FROM membros`);
  }
}
