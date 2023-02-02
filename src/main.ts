import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { authMiddleware } from './common/middlewares/authMiddleware/authMiddleware.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.use(authMiddleware);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
