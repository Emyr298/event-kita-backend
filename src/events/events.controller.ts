import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Query,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EventCategory } from 'src/common/entities/event.entity';
import { User } from 'src/common/entities/user.entity';
import { GetEventsDto, PostEventDto, PutEventDto } from './dto/events.dto';
import {
  EventsService,
  FindAllOrderBy,
  FindAllQuery,
} from './services/eventsServices.service';
import { Request } from 'express';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getEvents(@Query() query: GetEventsDto) {
    const findQuery: FindAllQuery = {
      name: query.name,
      category: EventCategory[query.category],
      orderBy: FindAllOrderBy[query.orderBy],
      pageNumber: parseInt(query.pageNumber),
      contentPerPage: parseInt(query.contentPerPage),
    };
    const events = await this.eventsService.findAllEvents(findQuery);
    return events;
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    const eventId = Number(id);
    const event = await this.eventsService.findOneEvent(eventId);
    if (!event) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    return event;
  }

  @Get('joined')
  async getJoinEvent(@Req() req: Request) {
    const user: User = req['user'].information;
    if (!user) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }
    try {
      const events = await this.eventsService.findJoinedEvents(user.id);
      return events;
    } catch (error) {
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST, error);
    }
  }

  @Post('join/:id')
  async postJoinedEvent(@Req() req: Request, @Param('id') id: string) {
    const user: User = req['user'].information;
    if (!user) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }
    try {
      await this.eventsService.joinEvent(user.id, Number(id));
      return {
        status: 'success',
      };
    } catch (error) {
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST, error);
    }
  }

  @Post()
  async postEvent(@Req() req: Request, @Body() body: PostEventDto) {
    const user: User = req['user'].information;
    if (!user) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }
    const eventData = {
      name: body.name,
      category: EventCategory[body.category],
      description: body.description,
      location: body.location,
      start_time: new Date(body.startTime),
      end_time: new Date(body.endTime),
      image_url: body.imageUrl,
      user: user,
    };
    try {
      const event = await this.eventsService.createEvent(eventData);
      return event;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async putEvent(
    @Req() req: Request,
    @Body() body: PutEventDto,
    @Param('id') id: string,
  ) {
    const curUser: User = req['user'].information;
    if (!curUser) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }
    const eventId = Number(id);
    const event = await this.eventsService.findOneEvent(eventId);
    if (!event) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    if (event.user.id !== curUser.id) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }
    const eventData = {
      name: body.name ? body.name : undefined,
      category: body.category ? EventCategory[body.category] : undefined,
      description:
        body.description || typeof body.description === 'string'
          ? body.description
          : undefined,
      location: body.location ? body.location : undefined,
      start_time: body.startTime ? new Date(body.startTime) : undefined,
      end_time: body.endTime ? new Date(body.endTime) : undefined,
      image_url: body.imageUrl ? body.imageUrl : undefined,
    };
    try {
      const event = await this.eventsService.updateEvent(eventId, eventData);
      return event;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteEvent(@Req() req: Request, @Param('id') id: string) {
    const curUser: User = req['user'].information;
    if (!curUser) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }
    const eventId = Number(id);
    const event = await this.eventsService.findOneEvent(eventId);
    if (!event) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    if (event.user.id !== curUser.id) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }
    await this.eventsService.deleteEvent(eventId);
    return {
      status: 'success',
    };
  }

  @Delete('join/:id')
  async deleteJoinedEvent(@Req() req: Request, @Param('id') id: string) {
    const user: User = req['user'].information;
    if (!user) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }
    try {
      await this.eventsService.leaveEvent(user.id, Number(id));
      return {
        status: 'success',
      };
    } catch (error) {
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST, error);
    }
  }
}
