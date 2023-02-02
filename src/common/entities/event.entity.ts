import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export type EventCategory =
  | 'attractions'
  | 'music'
  | 'arts and culture'
  | 'education';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public name: string;

  @Column({ type: 'float', nullable: false })
  public rating: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  public category: EventCategory;

  @Column({ type: 'text', nullable: false })
  public description: string;

  @Column({ nullable: false })
  public location: string;

  @Column({ type: 'timestamptz', nullable: false })
  public start_time: Date;

  @Column({ type: 'timestamptz', nullable: false })
  public end_time: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  public user: User;

  @OneToMany(() => EventImage, (eventImage) => eventImage.event)
  public image_urls: string;
}

@Entity('event_picture')
export class EventImage {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Event, (event) => event.image_urls, {
    onDelete: 'CASCADE',
  })
  public event: Event;

  @Column({ nullable: false })
  public image_url: string;
}
