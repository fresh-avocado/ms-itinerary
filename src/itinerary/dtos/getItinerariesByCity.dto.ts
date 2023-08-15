import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetItinerariesByCityDTO {
  @ApiProperty({
    description: 'Self-explanatory',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cityOfOrigin?: string;

  @ApiProperty({
    description: 'Self-explanatory',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cityOfDestination?: string;
}
