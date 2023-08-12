import { IsUUID } from 'class-validator';

export class DeleteItineraryFromShoppingCartDTO {
  @IsUUID()
  itineraryId: string;
}
