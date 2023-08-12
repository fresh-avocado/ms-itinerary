import { Injectable, Logger } from '@nestjs/common';
import { ItineraryService } from './itinerary/itinerary.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(ItineraryService.name);

  getHello(): string {
    return 'Hello World!';
  }
}
