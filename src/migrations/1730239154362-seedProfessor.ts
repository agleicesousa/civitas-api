import { MigrationInterface, QueryRunner } from 'typeorm';
import { TipoConta } from '../entities/baseEntity';
import { criptografarSenha } from '../utils/senhaUtils';

export class SeedProfessor1730239154362 implements MigrationInterface {
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
                '123456',
                'Alessandra Lima',
                '1990-01-01',
                '12.345.678-9',
                '806.315.210-70',
                '${TipoConta.PROFESSOR}',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
        `);

    const membroId = membroResult.insertId;
    const adminId = await queryRunner.query(`
        SELECT id FROM admin WHERE email ='admin.principal12310@gmail.com'
    `);

    const hashedPassword = await criptografarSenha('senha321');
    const professorResult = await queryRunner.query(`
            INSERT INTO professores (
                membroId,
                senha,
                adminId,
                dataCriacao,
                dataAtualizacao
            ) VALUES (
                ${membroId},
                '${hashedPassword}',
                ${adminId[0].id},
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
        `);

    const professorId = professorResult.insertId;

    const turmas = await queryRunner.query(`
            SELECT id FROM turmas 
            WHERE turmaApelido IN ('4º ano B', '5º ano A')
        `);

    for (const turma of turmas) {
      await queryRunner.query(`
                INSERT INTO professoresTurma (
                    professoresId,
                    turmasId
                ) VALUES (
                    ${professorId},
                    ${turma.id}
                )
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM professoresTurma 
            WHERE professoresId IN (
                SELECT p.id FROM professores p
                JOIN membros m ON p.membroId = m.id
                WHERE m.cpf = '806.315.210-70'
            )
        `);

    await queryRunner.query(`
            DELETE FROM professores 
            WHERE membroId IN (
                SELECT id FROM membros 
                WHERE cpf = '806.315.210-70'
            )
        `);

    await queryRunner.query(`
            DELETE FROM membros 
            WHERE cpf = '806.315.210-70'
        `);
  }
}
