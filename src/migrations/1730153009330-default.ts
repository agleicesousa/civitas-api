import { MigrationInterface, QueryRunner } from 'typeorm';

export class Default1730153009330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`membros\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dataCriacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`dataAtualizacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`numeroMatricula\` varchar(255) NOT NULL, \`nomeCompleto\` varchar(255) NOT NULL, \`dataNascimento\` datetime NOT NULL, \`rg\` varchar(255) NOT NULL, \`cpf\` varchar(255) NOT NULL, \`tipoConta\` enum ('admin', 'professor', 'aluno', 'responsavel') NOT NULL, UNIQUE INDEX \`IDX_83f06c3e8144d3331bab2fba60\` (\`numeroMatricula\`), UNIQUE INDEX \`IDX_2ac16a66cb8cecd394b508262d\` (\`rg\`), UNIQUE INDEX \`IDX_15ff93ce81dd5e7786e0b0e0c1\` (\`cpf\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`
            CREATE TABLE \`admin\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`dataCriacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`dataAtualizacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`email\` varchar(255) NOT NULL,
                \`senha\` varchar(255) NOT NULL,
                \`membroId\` int NULL,
                UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
    await queryRunner.query(
      `CREATE TABLE \`alunos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dataCriacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`dataAtualizacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`membroId\` int NULL, \`responsavelId\` int NULL, \`adminId\` int NULL, \`turmaId\` int NULL, UNIQUE INDEX \`REL_911a33d0db09aff3f730f350d8\` (\`membroId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`professores\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dataCriacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`dataAtualizacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`senha\` varchar(255) NOT NULL, \`membroId\` int NULL, UNIQUE INDEX \`REL_5ed34ab2d81d30d48ec53d129b\` (\`membroId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`turmas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dataCriacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`dataAtualizacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`anoLetivo\` enum ('1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano') NOT NULL, \`periodoLetivo\` enum ('Manhã', 'Tarde', 'Noite') NOT NULL, \`ensino\` enum ('Maternal', 'Pré-escola', 'Ensino fundamental 1') NOT NULL, \`turmaApelido\` varchar(20) NOT NULL, \`adminId\` int NULL, UNIQUE INDEX \`IDX_bfb668fe20328a4515ae22806d\` (\`turmaApelido\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`professoresTurma\` (\`professoresId\` int NOT NULL, \`turmasId\` int NOT NULL, INDEX \`IDX_dd32a83f31f06c74dbebc2166e\` (\`professoresId\`), INDEX \`IDX_37e04c4f1994afaa314e8b1b44\` (\`turmasId\`), PRIMARY KEY (\`professoresId\`, \`turmasId\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`admin\` ADD CONSTRAINT \`FK_9a828f26f916d45f293b209e1d6\` FOREIGN KEY (\`membroId\`) REFERENCES \`membros\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`alunos\` ADD CONSTRAINT \`FK_911a33d0db09aff3f730f350d8f\` FOREIGN KEY (\`membroId\`) REFERENCES \`membros\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`alunos\` ADD CONSTRAINT \`FK_1d802752ff81ce94fd4968286b8\` FOREIGN KEY (\`responsavelId\`) REFERENCES \`membros\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`alunos\` ADD CONSTRAINT \`FK_cfaf311e88fe548008461db7b4e\` FOREIGN KEY (\`adminId\`) REFERENCES \`membros\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`alunos\` ADD CONSTRAINT \`FK_3ec17a7ab8563202182a82d0b6b\` FOREIGN KEY (\`turmaId\`) REFERENCES \`turmas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`professores\` ADD CONSTRAINT \`FK_5ed34ab2d81d30d48ec53d129bc\` FOREIGN KEY (\`membroId\`) REFERENCES \`membros\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`
            ALTER TABLE \`professores\`
            ADD COLUMN \`adminId\` int NULL,
            ADD CONSTRAINT \`FK_professor_admin\`
            FOREIGN KEY (\`adminId\`)
            REFERENCES \`admin\`(\`id\`)
            ON DELETE SET NULL
            ON UPDATE CASCADE;
        `);

    await queryRunner.query(
      `ALTER TABLE \`turmas\` ADD CONSTRAINT \`FK_e1a943e1ddb5e62b483980f68df\` FOREIGN KEY (\`adminId\`) REFERENCES \`admin\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`professoresTurma\` ADD CONSTRAINT \`FK_dd32a83f31f06c74dbebc2166e5\` FOREIGN KEY (\`professoresId\`) REFERENCES \`professores\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`professoresTurma\` ADD CONSTRAINT \`FK_37e04c4f1994afaa314e8b1b440\` FOREIGN KEY (\`turmasId\`) REFERENCES \`turmas\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`professoresTurma\` DROP FOREIGN KEY \`FK_37e04c4f1994afaa314e8b1b440\``
    );
    await queryRunner.query(
      `ALTER TABLE \`professoresTurma\` DROP FOREIGN KEY \`FK_dd32a83f31f06c74dbebc2166e5\``
    );
    await queryRunner.query(
      `ALTER TABLE \`turmas\` DROP FOREIGN KEY \`FK_e1a943e1ddb5e62b483980f68df\``
    );
    await queryRunner.query(
      `ALTER TABLE \`professores\` DROP FOREIGN KEY \`FK_5ed34ab2d81d30d48ec53d129bc\``
    );
    await queryRunner.query(
      `ALTER TABLE \`alunos\` DROP FOREIGN KEY \`FK_3ec17a7ab8563202182a82d0b6b\``
    );
    await queryRunner.query(
      `ALTER TABLE \`alunos\` DROP FOREIGN KEY \`FK_cfaf311e88fe548008461db7b4e\``
    );
    await queryRunner.query(
      `ALTER TABLE \`alunos\` DROP FOREIGN KEY \`FK_1d802752ff81ce94fd4968286b8\``
    );
    await queryRunner.query(
      `ALTER TABLE \`alunos\` DROP FOREIGN KEY \`FK_911a33d0db09aff3f730f350d8f\``
    );
    await queryRunner.query(
      `ALTER TABLE \`admin\` DROP FOREIGN KEY \`FK_9a828f26f916d45f293b209e1d6\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_37e04c4f1994afaa314e8b1b44\` ON \`professoresTurma\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_dd32a83f31f06c74dbebc2166e\` ON \`professoresTurma\``
    );
    await queryRunner.query(`DROP TABLE \`professoresTurma\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_bfb668fe20328a4515ae22806d\` ON \`turmas\``
    );
    await queryRunner.query(`DROP TABLE \`turmas\``);
    await queryRunner.query(
      `DROP INDEX \`REL_5ed34ab2d81d30d48ec53d129b\` ON \`professores\``
    );
    await queryRunner.query(`DROP TABLE \`professores\``);
    await queryRunner.query(
      `DROP INDEX \`REL_911a33d0db09aff3f730f350d8\` ON \`alunos\``
    );
    await queryRunner.query(`DROP TABLE \`alunos\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_de87485f6489f5d0995f584195\` ON \`admin\``
    );
    await queryRunner.query(`DROP TABLE \`admin\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_15ff93ce81dd5e7786e0b0e0c1\` ON \`membros\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2ac16a66cb8cecd394b508262d\` ON \`membros\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_83f06c3e8144d3331bab2fba60\` ON \`membros\``
    );
    await queryRunner.query(`DROP TABLE \`membros\``);
  }
}
