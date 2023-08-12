import { Bus, BusSeatCapacity } from 'src/buses/entities/bus.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Itinerary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('text')
  cityOfOrigin: string;

  @Index()
  @Column('text')
  cityOfDestination: string;

  @Index()
  @Column('timestamp')
  departureDate: Date;

  @Column('timestamp')
  arrivalDate: Date;

  @Column('real')
  basePrice: number;

  @Column('uuid')
  busId: string;

  @ManyToOne(() => Bus)
  @JoinColumn({ name: 'busId' })
  bus: Bus;

  @Column('simple-json')
  capacity: BusSeatCapacity;
}
