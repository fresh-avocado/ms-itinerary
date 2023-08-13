import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// TODO: create relevant indexes

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  userEmail: string;

  @Column('uuid')
  busId: string;

  @Column('uuid')
  itineraryId: string;

  @CreateDateColumn()
  createdAt: Date;
}
