import * as expressSwaggerGenerator from 'express-swagger-generator';
import { Application } from 'express';

export function generateSwagger(app: Application) {
  const expressSwagger = expressSwaggerGenerator(app);
  let options = {
    swaggerDefinition: {
      info: {
        description: 'This is a sample server',
        title: 'Swagger',
        version: '1.0.0'
      },
      host: 'localhost:5500',
      basePath: '/v1',
      produces: ['application/json', 'application/xml'],
      schemes: ['http', 'https'],
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: ''
        }
      }
    },
    basedir: __dirname, //app absolute path
    files: ['../**/*router.ts'] //Path to the API handle folder
  };
  expressSwagger(options);
}
