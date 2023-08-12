import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetItinerariesByCityDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cityOfOrigin?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cityOfDestination?: string;
}
