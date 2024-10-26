import { DataSource } from 'typeorm';
import 'dotenv/config';

export const MysqlDataSource = new DataSource({
  name: 'default',
  type: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  url: process.env.DB_CONNECTION_STRING,
  entities: ['src/entities/*.ts', 'entities/*.js'],
  migrations: ['src/migrations/*.ts'],
  logging: true,
  synchronize: true
});
