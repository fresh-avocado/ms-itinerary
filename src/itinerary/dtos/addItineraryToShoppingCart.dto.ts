import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { BusSeatType } from 'src/buses/enums/busSeatType.enum';

export class AddItineraryToShoppingCartDTO {
  @ApiProperty({
    description: 'ID of the itinerary we wish to add to the shopping cart',
  })
  @IsUUID()
  itineraryId: string;

  @ApiProperty({
    description: "Type of the seat we want on the itinerary's bus",
    enum: [BusSeatType.EXECUTIVE, BusSeatType.PREMIUM, BusSeatType.TOURIST],
  })
  @IsEnum(BusSeatType)
  seatType: BusSeatType;
}
