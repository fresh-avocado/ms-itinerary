import { Bus } from 'src/buses/entities/bus.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Itinerary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cityOfOrigin: string;

  @Column()
  cityOfDestination: string;

  // TODO: ensure date is created with proper time zone
  @Column({ type: 'timestamptz', precision: 3 })
  departureDate: Date;

  // new Date(new Date().toLocaleString('es', { timeZone: 'America/Lima' }))

  @Column({ type: 'timestamptz', precision: 3 })
  arrivalDate: Date;

  @Column()
  basePrice: number;

  @OneToOne(() => Bus)
  @JoinColumn()
  bus: Bus;

  @Column('simple-json')
  capacity: { [seatType: string]: number };
}
