import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum EventCategory {
  attractions = 'attractions',
  music = 'music',
  artsAndCulture = 'artsAndCulture',
  education = 'education',
}

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public name: string;

  @Column({ type: 'int', nullable: false })
  public participants: number;

  @Column({ type: 'enum', enum: EventCategory, nullable: false })
  public category: EventCategory;

  @Column({ type: 'text', nullable: false })
  public description: string;

  @Column({ nullable: false })
  public location: string;

  @Column({ type: 'timestamptz', nullable: false })
  public start_time: Date;

  @Column({ type: 'timestamptz', nullable: false })
  public end_time: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  public user: User;

  @Column({ nullable: false })
  public userId: string;

  @Column({ nullable: false })
  public image_url: string;

  @ManyToMany(() => User, (user) => user.participated_events)
  @JoinTable()
  public participated_users: User[];
}
