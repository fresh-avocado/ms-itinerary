import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetReservationsDTO {
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  itineraryId?: string;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  busId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userEmail?: string;
}
