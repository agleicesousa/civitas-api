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
// import responsaveisRouter from './routes/responsaveisRoutes';
// import alunoRouter from './routes/alunosRoutes';
import loginRouter from './routes/loginRoutes';
MysqlDataSource.initialize()
  .then(() => {
    console.log('Database initialized!');
  })
  .catch((err) => {
    console.error('Database Error: ', err);
  });

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

app.use('/admin', adminRouter);
app.use('/membros', membrosRouter);
app.use('/turmas', turmasRouter);
app.use('/professores', professorRouter);
// app.use('/responsaveis', responsaveisRouter);
// app.use('/alunos', alunoRouter);
app.use('/auth', loginRouter);
app.use(errorHandler);

const swaggerSpec = swaggerJSDoc(swaggerConfig);

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get('/swagger.json', (_req, res) => res.send(swaggerSpec));

console.log(`Add swagger on /swagger`);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});
