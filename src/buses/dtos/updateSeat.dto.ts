import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { BusSeatType } from '../enums/busSeatType.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSeatDTO {
  @ApiProperty({
    description: 'ID of the bus whose seat capacity we wish to update',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Seat type of the bus whose capacity we wish to update',
    enum: [BusSeatType.TOURIST, BusSeatType.EXECUTIVE, BusSeatType.PREMIUM],
  })
  @IsEnum(BusSeatType)
  seat: BusSeatType;

  @ApiProperty({
    description: 'New capacity of the selected seatType',
  })
  @IsNumber()
  capacity: number;
}
