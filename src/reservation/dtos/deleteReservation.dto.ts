import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { BusSeatType } from 'src/buses/enums/busSeatType.enum';

export class DeleteReservationDTO {
  @ApiProperty({
    description: 'ID of the reservation we wish to delete',
  })
  @IsUUID()
  reservationId: string;

  // nos ahorran un find:

  @ApiProperty({
    description: 'Type of the reserved seat',
    enum: [BusSeatType.TOURIST, BusSeatType.EXECUTIVE, BusSeatType.PREMIUM],
  })
  @IsEnum(BusSeatType)
  seatType: BusSeatType;

  @ApiProperty({
    description: 'ID of the reserved itinerary',
  })
  @IsUUID()
  itineraryId: string;
}
