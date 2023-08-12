import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Itinerary } from './entities/itinerary.entity';
import { Repository } from 'typeorm';
import { ItineraryDTO } from './dtos/itinerary.dto';
import { stringifyError } from 'src/utils/stringifyError';
import {
  CREATE_ITINERARY_ERROR,
  GET_ITINERARIES_ERROR,
} from 'src/utils/constants/errorMessages';
import { Bus } from 'src/buses/entities/bus.entity';

@Injectable()
export class ItineraryService {
  private readonly logger = new Logger(ItineraryService.name);

  constructor(
    @InjectRepository(Itinerary)
    private readonly itineraryRepository: Repository<Itinerary>,
    @InjectRepository(Bus) private readonly busRepository: Repository<Bus>,
  ) {}

  async createItinerary(itineraryDTO: ItineraryDTO): Promise<Itinerary> {
    // TODO: prevent creating itineraries that overlap (index by busId)
    try {
      const bus = await this.busRepository.findOne({
        where: { id: itineraryDTO.bus as string },
        select: ['capacity'],
      });
      itineraryDTO.capacity = bus.capacity;
      const newItinerary = this.itineraryRepository.create(
        itineraryDTO as Itinerary,
      );
      const savedItinerary = await this.itineraryRepository.save(newItinerary);
      return savedItinerary;
    } catch (error) {
      this.logger.error(`error creating user: ${stringifyError(error)}`);
      throw new HttpException(
        CREATE_ITINERARY_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllItineraries(): Promise<Itinerary[]> {
    try {
      return await this.itineraryRepository.find();
    } catch (error) {
      this.logger.error(`error getting itineraries: ${stringifyError(error)}`);
      throw new HttpException(
        GET_ITINERARIES_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
