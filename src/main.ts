import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  const config = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ms-itinerary')
    .setDescription('Maneja todo relacionado a buses, itinerarios y reservas.')
    .setVersion('1.0')
    .addCookieAuth(
      'sessionId',
      {
        type: 'http',
        in: 'HTTP Header',
        description:
          'Signed cookie that holds the sessionId of the current user',
      },
      'sessionId',
    )
    .addTag('bus')
    .addTag('itinerary')
    .addTag('reservation')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup('api', app, document);
  await app.register(fastifyCookie, {
    secret: config.get<string>('COOKIE_SECRET'),
  });
  await app.listen(3002, '0.0.0.0');
}
bootstrap();
