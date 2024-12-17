import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Civitas API',
      description: 'Documentação da API do projeto Civitas',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:4444', // URL do servidor de desenvolvimento
        description: 'Servidor Local'
      }
    ],
    externalDocs: {
      description: 'Swagger JSON',
      url: '../swagger.json' // Confirme se esse caminho é acessível
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT' // Especifique que o formato esperado é JWT
        }
      }
    },
    security: [
      {
        BearerAuth: [] // Aplica a autenticação BearerAuth globalmente (se necessário)
      }
    ]
  },
  apis: ['src/routes/*.ts', 'routes/*.js'] // Caminhos para buscar as rotas
};
