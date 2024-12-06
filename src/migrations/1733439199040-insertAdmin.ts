import { TipoConta } from '../entities/baseEntity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InsertAdmin1733439199040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabelaMembros = await queryRunner.hasTable('membros');
    const tabelaAdmin = await queryRunner.hasTable('admin');

    if (tabelaMembros && tabelaAdmin) {
      const repositorioMembros =
        queryRunner.connection.getRepository('membros');
      const repositorioAdmin = queryRunner.connection.getRepository('admin');

      const membro = repositorioMembros.create({
        numeroMatricula: 'admin',
        email: 'admin@admin.com',
        senha: 'password123',
        nomeCompleto: 'Admin',
        tipoConta: TipoConta.ADMIN
      });

      const membroSalvo = await repositorioMembros.save(membro);
      const admin = repositorioAdmin.create({
        membro: membroSalvo
      });

      await repositorioAdmin.save(admin);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const repositorioMembros = queryRunner.connection.getRepository('membros');

    await repositorioMembros.delete({
      email: 'admin@admin.com'
    });
  }
}
