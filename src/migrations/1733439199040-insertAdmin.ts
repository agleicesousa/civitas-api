import { TipoConta } from '../entities/baseEntity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import 'dotenv/config';
import { criptografarSenha } from '../utils/validarSenhaUtils';

export class InsertAdmin1733439199040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabelaMembros = await queryRunner.hasTable('membros');
    const tabelaAdmin = await queryRunner.hasTable('admin');

    if (tabelaMembros && tabelaAdmin) {
      const repositorioMembros =
        queryRunner.connection.getRepository('membros');
      const repositorioAdmin = queryRunner.connection.getRepository('admin');

      const senhaCriptografada = await criptografarSenha(
        process.env.ADMIN_PASSWORD
      );

      const membro = repositorioMembros.create({
        email: process.env.ADMIN_EMAIL,
        senha: senhaCriptografada,
        tipoConta: TipoConta.ADMIN
      });

      const membroSalvo = await repositorioMembros.save(membro);
      const admin = repositorioAdmin.create({
        membro: membroSalvo
      });

      await repositorioAdmin.save(admin);
    }
  }

  public async down(): Promise<void> {
    console.log('Nenhuma ação executada no down.');
  }
}
