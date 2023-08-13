import { IsEnum, IsUUID } from 'class-validator';
import { BusSeatType } from 'src/buses/enums/busSeatType.enum';

export class DeleteReservationDTO {
  @IsUUID()
  reservationId: string;

  // nos ahorran un find:

  @IsEnum(BusSeatType)
  seatType: BusSeatType;

  @IsUUID()
  itineraryId: string;
}
