import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLoggerService } from './logger/logger';
import { AppDataSource } from './orm_configs/public_datasource';
import { getTenantConnection } from './modules/tenency/tenency.utils';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './expections/exception.filter';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { env } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService(),
  });

  const querymanager = await AppDataSource.initialize();
  await querymanager.runMigrations();
  const schemas = await querymanager.query(
    'select schema_name as name from information_schema.schemata;',
  );

  for (let i = 1; i < schemas.length; i++) {
    const { name: schema } = schemas[i];
    if (schema.startsWith('tenent_')) {
      const tenantId = schema.replace('tenant_', '');
      const connection = await getTenantConnection(tenantId);
      // console.info(connection);
      await connection.runMigrations();

      await connection.destroy();
    }
  }
  await querymanager.destroy();

  const config = new DocumentBuilder()
    .setTitle('PRIMECLM')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        schema: 'Bearer',
        bearerFormat: 'Token',
      } as SecuritySchemeObject,
      'ADMIN',
    )
    .addBearerAuth(
      {
        type: 'http',
        schema: 'Bearer',
        bearerFormat: 'Token',
      } as SecuritySchemeObject,
      'USER',
    )
    .addServer(env.server_url)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(env.swagger_url || 'swagger', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: false }));

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
