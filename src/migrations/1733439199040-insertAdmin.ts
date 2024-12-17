import { TipoConta } from '../entities/baseEntity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import 'dotenv/config';
import { criptografarSenha } from '../utils/validarSenhaUtils';

/**
 * Migration responsável por inserir um usuário administrador padrão no banco de dados.
 * Essa ação é executada caso as tabelas necessárias existam no banco.
 *
 * A senha é criptografada antes de ser salva.
 */
export class InsertAdmin1733439199040 implements MigrationInterface {
  /**
   * Método executado para aplicar a migração.
   * Insere um usuário administrador no banco de dados com as credenciais definidas em variáveis de ambiente.
   *
   * Verifica se as tabelas necessárias existem e procede com a criação do usuário.
   *
   * @param queryRunner - O objeto responsável por realizar as operações no banco de dados.
   */
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

  /**
   * Método executado para desfazer a migração.
   * Atualmente, nenhuma ação é executada no método `down`.
   * No caso de implementação futura, você poderia apagar o administrador adicionado.
   */
  public async down(): Promise<void> {
    console.log('Nenhuma ação executada no down.');
  }
}
