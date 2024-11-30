import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
// import Fabricas from '../seeds/fabricas';
// import { Seeds } from '../seeds/seeds';

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/entities/**/*.ts'],
  logging: false,
  synchronize: true
  //  seeds: [Seeds],
  //  factories: [...Fabricas]
};

export const MysqlDataSource = new DataSource(options);
