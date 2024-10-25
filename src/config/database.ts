import { DataSource } from 'typeorm';
import 'dotenv/config';

export const MysqlDataSource = new DataSource({
  name: 'default',
  type: 'mysql',
  username: 'orion_root',
  password: 'j5m966qp7jiypfda',
  database: 'orion',
  url: process.env.DB_CONNECTION_STRING,
  entities: ['src/entities/*.ts', 'entities/*.js'],
  migrations: ['src/migrations/*.ts'],
  logging: true,
  synchronize: true
});
