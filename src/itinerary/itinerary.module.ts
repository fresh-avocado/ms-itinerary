import { Module } from '@nestjs/common';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';
import { Itinerary } from './entities/itinerary.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from 'src/buses/entities/bus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Itinerary, Bus])],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule {}
