import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteItineraryFromShoppingCartDTO {
  @ApiProperty({
    description: 'ID of the itinerary we wish to delete',
  })
  @IsUUID()
  itineraryId: string;
}
