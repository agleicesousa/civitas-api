import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Admin1733436982112 implements MigrationInterface {
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

  public async down(): Promise<void> {
    console.log('Nenhuma ação executada no down.');
  }
}
