import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { authMiddleware } from './common/middlewares/auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(authMiddleware);
  await app.listen(3001);
}
bootstrap();
