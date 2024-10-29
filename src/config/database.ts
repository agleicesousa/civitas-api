import { DataSource } from 'typeorm';
import 'dotenv/config';

export const MysqlDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/entities/**/*.ts', 'dist/entities/*.js'],
  logging: true,
  synchronize: true
});