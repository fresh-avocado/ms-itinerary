import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { BusSeatType } from '../enums/busSeatType.enum';

export class UpdateSeatDTO {
  @IsUUID()
  id: string;

  @IsEnum(BusSeatType)
  seat: BusSeatType;

  @IsNumber()
  capacity: number;
}
