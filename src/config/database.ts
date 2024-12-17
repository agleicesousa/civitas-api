import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

/**
 * Configurações para a instância do DataSource MySQL.
 * Variáveis de ambiente necessárias: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE.
 */
const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/entities/**/*.ts'],
  logging: false,
  synchronize: true,
  migrations: ['src/migrations/*.ts']
};

/**
 * Instância do DataSource configurada para conectar-se ao banco MySQL.
 * Utilize para interagir com o banco, executar migrações e carregar repositórios.
 * @example `await MysqlDataSource.initialize();`
 */
export const MysqlDataSource = new DataSource(options);
