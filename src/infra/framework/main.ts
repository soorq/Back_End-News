import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DOMAIN, NODE_ENV, PORT } from '@/shared/env';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as chalk from 'chalk';
import {
  HttpException,
  HttpStatus,
  Logger,
  ValidationPipe,
} from '@nestjs/common';

const MOCK_APP_URLS = [
  'https://example.com',
  'http://localhost:5173', // vite
  'http://localhost:3000', // react
];

declare const module: any;

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      cors: false,
    });

    /**
     * Sets the global prefix of the app to 'api' and enables CORS with specific configurations:
     */
    app.setGlobalPrefix('api');

    /**
     * Adds the cookie parser middleware to the application for handling cookies.
     * Sets a global filter using CsrfFilter for handling CSRF protection.
     */
    app.use(cookieParser());

    /**
     * Adds the CsrfFilter as a global filter to the application.
     */
    // app.useGlobalFilters(new CsrfFilter());

    /**
     * Adds a global validation pipe to the NestJS application with the option to transform the payload.
     */
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    /**
     * Enable CORS for the NestJS application with specific configurations:
     * - Allows requests from specified origins in the MOCK_APP_URLS array
     * - Rejects requests from origins not in the MOCK_APP_URLS array with a 409 Conflict status
     * - Sets credentials to true
     * - Specifies allowed headers and methods for the CORS policy
     */
    app.enableCors({
      origin: (origin, cb) => {
        if (!origin || MOCK_APP_URLS.indexOf(origin) !== -1) {
          cb(null, true);
        } else {
          cb(new HttpException('', HttpStatus.CONFLICT));
        }
      },
      credentials: true,
      allowedHeaders:
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, X',
      methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    });

    /**
     * Adds rate limiting middleware to the application with a window of 15 minutes and a maximum of 10,000 requests.
     */
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10000,
      }),
    );

    /**
     * Creates a Swagger document configuration using the DocumentBuilder with title 'Test-Api', tag 'test', version '1.0.0'.
     * Then creates a Swagger document using the configuration and sets up Swagger UI at '/api' endpoint in the app.
     */
    const CFG = new DocumentBuilder()
      .setTitle('Test-Api')
      .addTag('test', 'api')
      .setVersion('1.0.0')
      .build();

    const SWAGGER = SwaggerModule.createDocument(app, CFG);

    SwaggerModule.setup('ui', app, SWAGGER);

    // Listen port
    await app.listen(PORT);

    /**
     * Checks if the module is hot and performs specific actions if true.
     */
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }

    /**
     * Logs the server status message based on the NODE_ENV value:
     * - If NODE_ENV is not 'production', logs 'Server ready at https://DOMAIN:PORT' using chalk for styling.
     * - If NODE_ENV is 'production', logs 'Server is listening on port PORT or default 1010' using chalk for styling.
     */
    NODE_ENV !== 'production'
      ? Logger.log(
          `🚀  Server ready at https://${DOMAIN!}:${chalk
            .hex('#87e8de')
            .bold(`${PORT!}`)}`,
          'Bootstrap',
        )
      : Logger.log(
          `🚀  Server is listening on port ${chalk
            .hex('#87e8de')
            .bold(`${PORT || 1010}`)}`,
          'Bootstrap',
        );
  } catch (error) {
    Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false);
    process.exit();
  }
}

bootstrap().catch((e) => {
  throw e;
});
