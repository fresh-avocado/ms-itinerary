import { IsEnum, IsUUID } from 'class-validator';
import { BusSeatType } from 'src/buses/enums/busSeatType.enum';

export class AddItineraryToShoppingCartDTO {
  @IsUUID()
  itineraryId: string;

  @IsEnum(BusSeatType)
  seatType: BusSeatType;
}
