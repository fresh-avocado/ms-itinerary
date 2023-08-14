import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  userEmail: string;

  @Column('uuid')
  busId: string;

  @Index()
  @Column('uuid')
  itineraryId: string;

  @CreateDateColumn()
  createdAt: Date;
}
