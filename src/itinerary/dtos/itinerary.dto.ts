import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { BusSeatCapacity } from 'src/buses/entities/bus.entity';

export class ItineraryDTO {
  @ApiProperty({
    description: 'City the bus will depart from',
    example: 'Lima',
  })
  @IsString()
  @IsNotEmpty()
  cityOfOrigin: string;

  @ApiProperty({
    description: 'City the bus will arrive to',
    example: 'Huancayo',
  })
  @IsString()
  @IsNotEmpty()
  cityOfDestination: string;

  @ApiProperty({
    description: 'Date the bus will depart from the city of origin',
    type: 'date',
    example: '2023-08-15T01:48:47.355Z',
  })
  @IsDateString({ strict: true })
  departureDate: Date;

  @ApiProperty({
    description: 'Date the bus will arrive to the city of destination',
    type: 'date',
    example: '2023-08-15T10:48:47.355Z',
  })
  @IsDateString({ strict: true })
  arrivalDate: Date;

  @ApiProperty({
    description: 'The base price of the tourist seat',
  })
  @IsNumber()
  @Min(1)
  basePrice: number;

  @ApiProperty({
    description: 'ID of the bus that will carry out this itinerary',
  })
  @IsUUID()
  busId: string;

  @ApiProperty({
    description:
      "A JSON object that is keyed by the enum 'BusSeatType' and whose values are the capacities of each type of seat in the bus",
    example: {
      turista: 10,
      ejecutivo: 5,
      premium: 10,
    },
  })
  capacity: BusSeatCapacity;
}
