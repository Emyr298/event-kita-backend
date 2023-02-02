import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  MoreThanOrEqual,
  Like,
  FindOperator,
  FindOptionsOrderValue,
} from 'typeorm';
import {
  Event,
  EventCategory,
  EventImage,
} from 'src/common/entities/event.entity';
import { User } from 'src/common/entities/user.entity';

export interface FindAllQuery {
  name?: string;
  category?: EventCategory;
  laterThan?: Date;
  ratingMoreThan?: number;
  pageNumber?: number;
  contentPerPage?: number;
  orderBy?: FindAllOrderBy;
}

export enum FindAllOrderBy {
  byRating,
  byStartTime,
}

interface Where {
  name?: FindOperator<string>;
  category?: EventCategory;
  start_time?: FindOperator<Date>;
  rating?: FindOperator<number>;
}

interface Order {
  rating?: FindOptionsOrderValue;
  start_time?: FindOptionsOrderValue;
}

interface EventCreate {
  name: string;
  category: EventCategory;
  description: string;
  location: string;
  start_time: Date;
  end_time: Date;
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
    @InjectRepository(EventImage)
    private eventImageRepo: Repository<EventImage>,
  ) {}

  // Read All
  findAllEvents(query: FindAllQuery): Promise<Event[]> {
    const where: Where = {};
    const order: Order = {};

    if (query.name) where.name = Like(`%${query.name}%`);
    if (query.category) where.category = query.category;
    if (query.laterThan) where.start_time = MoreThanOrEqual(query.laterThan);
    if (query.ratingMoreThan)
      where.rating = MoreThanOrEqual(query.ratingMoreThan);

    if (query.orderBy == FindAllOrderBy.byStartTime) {
      order.start_time = 'ASC';
    } else {
      order.rating = 'DESC';
    }

    return this.eventRepo.find({
      where,
      order,
      skip: (query.pageNumber - 1) * query.contentPerPage,
      take: query.contentPerPage,
    });
  }

  // Read One
  findOneEvent(id: number): Promise<Event> {
    return this.eventRepo.findOneBy({ id: id });
  }

  // Create
  async createEvent(data: EventCreate): Promise<Event> {
    const event = this.eventRepo.create({
      name: data.name,
      rating: 0,
      category: data.category,
      description: data.description,
      location: data.location,
      start_time: data.start_time,
      end_time: data.end_time,
      user: data.user,
    });
    return await this.eventRepo.save(event);
  }

  async createEventImage(event: Event, imageUrl: string): Promise<EventImage> {
    const eventImage = this.eventImageRepo.create({
      event: event,
      image_url: imageUrl,
    });
    return await this.eventImageRepo.save(eventImage);
  }

  // Update
  async updateEvent(id: number, data: EventUpdate) {
    await this.eventRepo.update({ id }, data);
    return await this.eventRepo.findOneBy({ id });
  }

  // Delete
  async deleteEvent(id: number) {
    await this.eventRepo.delete({ id });
  }

  async deleteEventImage(id: number) {
    await this.eventImageRepo.delete({ id });
  }
}
