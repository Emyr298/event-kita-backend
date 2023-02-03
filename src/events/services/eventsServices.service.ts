import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOperator, FindOptionsOrderValue } from 'typeorm';
import { Event, EventCategory } from 'src/common/entities/event.entity';
import { User } from 'src/common/entities/user.entity';

export interface FindAllQuery {
  name?: string;
  category?: EventCategory;
  pageNumber?: number;
  contentPerPage?: number;
  orderBy?: FindAllOrderBy;
}

export enum FindAllOrderBy {
  byParticipants = 'byParticipants',
  byStartTime = 'byStartTime',
}

interface Where {
  name?: FindOperator<string>;
  category?: EventCategory;
  end_time?: FindOperator<Date>;
}

interface Order {
  participants?: FindOptionsOrderValue;
  start_time?: FindOptionsOrderValue;
}

interface EventCreate {
  name: string;
  category: EventCategory;
  description: string;
  location: string;
  start_time: Date;
  end_time: Date;
  image_url: string;
  user: User;
}

interface EventUpdate {
  name?: string;
  category?: EventCategory;
  description?: string;
  location?: string;
  start_time?: Date;
  end_time?: Date;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // Read All
  findAllEvents(query: FindAllQuery): Promise<Event[]> {
    const where: Where = {};
    const order: Order = {};

    if (query.name) where.name = Like(`%${query.name}%`);
    if (query.category) where.category = query.category;

    if (query.orderBy == FindAllOrderBy.byStartTime) {
      order.start_time = 'ASC';
    } else {
      order.participants = 'DESC';
    }

    return this.eventRepo.find({
      where,
      order,
      skip: (query.pageNumber - 1) * query.contentPerPage,
      take: query.contentPerPage,
    });
  }

  async findJoinedEvents(userId: string): Promise<Event[]> {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
      relations: ['participated_events'],
    });
    if (user) {
      return user.participated_events;
    }
    throw `User doesn't exists`;
  }

  // Read One
  findOneEvent(id: number): Promise<Event> {
    return this.eventRepo.findOne({
      where: { id: id },
      relations: ['user', 'participated_users'],
    });
  }

  // Create
  async createEvent(data: EventCreate): Promise<Event> {
    if (data.start_time.getTime() > data.end_time.getTime()) {
      throw 'start time must be earlier than end time';
    }

    const event = this.eventRepo.create({
      name: data.name,
      participants: 0,
      category: data.category,
      description: data.description,
      location: data.location,
      start_time: data.start_time,
      end_time: data.end_time,
      image_url: data.image_url,
      user: data.user,
    });
    return await this.eventRepo.save(event);
  }

  async joinEvent(userId: string, eventId: number): Promise<void> {
    const user = await this.userRepo.findOneBy({ id: userId });
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['participated_users'],
    });
    if (user && event) {
      event.participated_users = event.participated_users.filter((curUser) => {
        return curUser.id !== user.id;
      });
      event.participated_users.push(user);
      event.participants = event.participated_users.length;
      await this.eventRepo.save(event);
      return;
    }
    throw `User or event doesn't exists`;
  }

  // Update
  async updateEvent(id: number, data: EventUpdate) {
    const event = await this.eventRepo.findOneBy({ id });
    const new_start_time = data.start_time || event.start_time;
    const new_end_time = data.end_time || event.end_time;
    if (new_start_time.getTime() > new_end_time.getTime()) {
      throw 'start time must be earlier than end time';
    }

    await this.eventRepo.update({ id }, data);
    return await this.eventRepo.findOneBy({ id });
  }

  // Delete
  async deleteEvent(id: number) {
    await this.eventRepo.delete({ id });
  }

  async leaveEvent(userId: string, eventId: number): Promise<void> {
    const user = await this.userRepo.findOneBy({ id: userId });
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['participated_users'],
    });
    if (user && event) {
      event.participated_users = event.participated_users.filter((curUser) => {
        return curUser.id !== user.id;
      });
      event.participants = event.participated_users.length;
      await this.eventRepo.save(event);
      return;
    }
    throw `User or event doesn't exists`;
  }
}
