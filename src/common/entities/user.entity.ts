import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_acc')
export class User {
  @PrimaryColumn()
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
}
