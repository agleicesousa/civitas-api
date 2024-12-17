import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { MysqlDataSource } from './config/database';
import { swaggerConfig } from './config/swagger';
import { errorHandler } from './errors/errorHandler';
import adminRouter from './routes/adminRoutes';
import membrosRouter from './routes/membrosRoutes';
import turmasRouter from './routes/turmasRoutes';
import professorRouter from './routes/professorRoutes';
import alunoRouter from './routes/alunoRoutes';
import loginRouter from './routes/loginRoutes';
import pdiRouter from './routes/pdiRoutes';

const initializeDatabase = async () => {
  try {
    await MysqlDataSource.initialize();
    console.log('✅ Database initialized!');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  }
};

const setupSwagger = (app: express.Application) => {
  const swaggerSpec = swaggerJSDoc(swaggerConfig);
  app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get('/swagger.json', (_req, res) => res.send(swaggerSpec));
  console.log('✅ Swagger configured at /swagger');
};

const main = async () => {
  await initializeDatabase();

  const app = express();

  app.use(express.json());
  app.use(cors({ origin: true }));
  app.use(errorHandler);

  setupSwagger(app);

  app.use('/admin', adminRouter);
  app.use('/membros', membrosRouter);
  app.use('/turmas', turmasRouter);
  app.use('/professores', professorRouter);
  app.use('/pdi', pdiRouter);
  app.use('/alunos', alunoRouter);
  app.use('/auth', loginRouter);

  const PORT = process.env.SERVER_PORT || 3000;
  if (!PORT) {
    console.error('❌ SERVER_PORT não definido nas variáveis de ambiente.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
};

main();
