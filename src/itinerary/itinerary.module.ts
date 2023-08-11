import { Module } from '@nestjs/common';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';
import { Itinerary } from './entities/itinerary.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Itinerary])],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule {}
