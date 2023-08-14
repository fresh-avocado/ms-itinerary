import { Bus, BusSeatCapacity } from 'src/buses/entities/bus.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/*

  Es cierto que esta tabla tiene varios índices. Sin embargo, es una tabla
  a la cual no se le inserta tanto como se le lee. Los usuarios están leyendo
  constantemente los itinerarios, por lo que las lecturas deben ser rápidas.
  Además, solo los usuarios de tipo 'onroad' (admin) son capaces de insertar.

*/

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

  @Index()
  @Column('uuid')
  busId: string;

  @Column('timestamp')
  arrivalDate: Date;

  @Column('real')
  basePrice: number;

  @ManyToOne(() => Bus)
  @JoinColumn({ name: 'busId' })
  bus: Bus;

  @Column('simple-json')
  capacity: BusSeatCapacity;
}
