import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Migration para criar a tabela 'admin' no banco de dados.
 *
 * A tabela 'admin' é usada para armazenar informações de administradores no sistema,
 * incluindo dados básicos, autenticação e o tipo de conta.
 */
export class Admin1733436982112 implements MigrationInterface {
  /**
   * Método executado para aplicar a migração (criar tabela).
   * Verifica se a tabela já existe antes de criá-la para evitar erros no ambiente de migração.
   *
   * @param queryRunner - O objeto responsável por executar as operações no banco de dados.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('admin');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'admin',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment'
            },
            {
              name: 'nome',
              type: 'varchar',
              isNullable: false
            },
            {
              name: 'email',
              type: 'varchar',
              isNullable: false,
              isUnique: true
            },
            {
              name: 'senha',
              type: 'varchar',
              isNullable: false
            },
            {
              name: 'tipoConta',
              type: 'enum',
              enum: ['admin', 'professor', 'aluno'],
              default: "'admin'"
            },
            {
              name: 'dataCriacao',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP'
            },
            {
              name: 'dataAtualizacao',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP'
            }
          ]
        })
      );
    }
  }

  /**
   * Método executado para desfazer a migração (roll back).
   *
   * No caso dessa migração, nenhuma ação é realizada no método `down`.
   * É utilizado apenas para manter consistência em operações futuras.
   */
  public async down(): Promise<void> {
    console.log('Nenhuma ação executada no down.');
  }
}
