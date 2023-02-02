import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, EventImage } from 'src/common/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventImage])],
  controllers: [],
  providers: [],
})
export class AuthModule {}
