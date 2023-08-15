import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetReservationsDTO {
  @ApiProperty({
    description: 'Used to get reservations of a certain itinerary',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  itineraryId?: string;

  @ApiProperty({
    description: 'Used to get reservations of a certain bus',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  busId?: string;

  @ApiProperty({
    description: 'Used to get reservations of a certain user',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userEmail?: string;
}
