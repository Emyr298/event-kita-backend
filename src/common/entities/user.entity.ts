import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity('user_acc')
export class User {
  @PrimaryColumn({ type: 'varchar' })
  public id: string;

  @Column({ nullable: false })
  public first_name: string;

  @Column({ nullable: false })
  public last_name: string;

  @Column({ nullable: false })
  public email: string;

  @Column({ nullable: false })
  public photo_url: string;

  @Column({ type: 'timestamptz', nullable: false })
  public register_time: Date;

  @ManyToMany(() => Event, (event) => event.participated_users)
  public participated_events: Event[];
}
