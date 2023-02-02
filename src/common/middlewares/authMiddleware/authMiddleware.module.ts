import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { AuthMiddleware } from './authMiddleware.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthMiddleware],
})
export class AuthMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
