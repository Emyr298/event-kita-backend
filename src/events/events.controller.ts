import {
  Headers,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { User } from 'src/common/entities/user.entity';

@Controller('events')
export class EventsController {
  // constructor(private readonly usersService: UsersService) {}
}
