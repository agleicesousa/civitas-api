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

/**
 * Função para inicializar a conexão com o banco de dados.
 */
const initializeDatabase = async () => {
  try {
    await MysqlDataSource.initialize();
    console.log('✅ Database initialized!');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    process.exit(1); // Encerra o servidor caso a conexão com o banco falhe.
  }
};

/**
 * Configuração do Swagger para documentação da API.
 * @param app Express application instance.
 */
const setupSwagger = (app: express.Application) => {
  const swaggerSpec = swaggerJSDoc(swaggerConfig);

  // Configurações de Swagger UI.
  app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get('/swagger.json', (_req, res) => res.send(swaggerSpec));
  console.log('✅ Swagger configured at /swagger');
};

/**
 * Função principal que configura e inicializa o servidor Express.
 */
const main = async () => {
  await initializeDatabase();

  const app = express();

  // Configurações básicas para JSON e CORS.
  app.use(express.json());
  app.use(cors({ origin: true }));

  // Configura o tratamento global de erros da aplicação.
  app.use(errorHandler);

  // Configurações do Swagger.
  setupSwagger(app);

  // Configuração de rotas.
  app.use('/admin', adminRouter);
  app.use('/membros', membrosRouter);
  app.use('/turmas', turmasRouter);
  app.use('/professores', professorRouter);
  app.use('/pdi', pdiRouter);
  app.use('/alunos', alunoRouter);
  app.use('/auth', loginRouter);

  // Define a porta do servidor.
  const PORT = process.env.SERVER_PORT || 3000;
  if (!PORT) {
    console.error('❌ SERVER_PORT não definido nas variáveis de ambiente.');
    process.exit(1);
  }

  // Inicia o servidor na porta configurada.
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
};

// Executa a função principal.
main();
