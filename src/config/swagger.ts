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
        url: 'http://localhost:4444',
        description: 'Servidor Local'
      }
    ],
    externalDocs: {
      description: 'Swagger JSON',
      url: '../swagger.json'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['src/routes/*.ts', 'routes/*.js']
};
