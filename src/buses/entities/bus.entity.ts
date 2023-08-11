import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Operator } from '../enums/operator.enum';

@Entity()
@Index(['licensePlate', 'operator'], { unique: true })
export class Bus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  licensePlate: string;

  @Column({ type: 'enum', enum: Operator })
  operator: Operator;

  @Column('simple-json')
  capacity: { [seatType: string]: number };
}
