import { Bus, BusSeatCapacity } from 'src/buses/entities/bus.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Itinerary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  cityOfOrigin: string;

  @Column('text')
  cityOfDestination: string;

  @Column('timestamp')
  departureDate: Date;

  @Column('timestamp')
  arrivalDate: Date;

  @Column('real')
  basePrice: number;

  @ManyToOne(() => Bus)
  @JoinColumn({})
  bus: Bus;

  @Column('simple-json')
  capacity: BusSeatCapacity;
}
