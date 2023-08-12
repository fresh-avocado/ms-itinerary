import { IsDateString, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { Bus, BusSeatCapacity } from 'src/buses/entities/bus.entity';

export class ItineraryDTO {
  @IsString()
  cityOfOrigin: string;

  @IsString()
  cityOfDestination: string;

  @IsDateString({ strict: true })
  departureDate: Date;

  @IsDateString({ strict: true })
  arrivalDate: Date;

  @IsNumber()
  @Min(1)
  basePrice: number;

  @IsUUID()
  bus: Bus | string;

  capacity: BusSeatCapacity;
}
