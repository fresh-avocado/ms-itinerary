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
  @IsString()
  @IsNotEmpty()
  cityOfOrigin: string;

  @IsString()
  @IsNotEmpty()
  cityOfDestination: string;

  @IsDateString({ strict: true })
  departureDate: Date;

  @IsDateString({ strict: true })
  arrivalDate: Date;

  @IsNumber()
  @Min(1)
  basePrice: number;

  @IsUUID()
  busId: string;

  capacity: BusSeatCapacity;
}
