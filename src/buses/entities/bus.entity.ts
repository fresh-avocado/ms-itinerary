import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Operator } from '../enums/operator.enum';
import { BusSeatType } from '../enums/busSeatType.enum';

export type BusSeatCapacity = {
  [key in BusSeatType]: number;
};

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
  capacity: BusSeatCapacity;
}
