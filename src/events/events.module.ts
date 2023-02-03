import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/common/entities/event.entity';
import { User } from 'src/common/entities/user.entity';
import { EventsController } from './events.controller';
import { EventsService } from './services/eventsServices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
