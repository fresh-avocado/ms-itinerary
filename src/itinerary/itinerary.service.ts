import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Itinerary } from './entities/itinerary.entity';
import {
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { ItineraryDTO } from './dtos/itinerary.dto';
import { stringifyError } from 'src/utils/stringifyError';
import {
  CREATE_ITINERARY_ERROR,
  GET_ITINERARIES_ERROR,
} from 'src/utils/constants/errorMessages';
import { Bus } from 'src/buses/entities/bus.entity';
import { GetItinerariesByCityDTO } from './dtos/getItinerariesByCity.dto';
import { AddItineraryToShoppingCartDTO } from './dtos/addItineraryToShoppingCart.dto';
import { RedisService } from 'src/redis/redis.service';
import { ClientSession } from 'src/redis/types/session.type';

@Injectable()
export class ItineraryService {
  private readonly logger = new Logger(ItineraryService.name);

  constructor(
    @InjectRepository(Itinerary)
    private readonly itineraryRepository: Repository<Itinerary>,
    @InjectRepository(Bus) private readonly busRepository: Repository<Bus>,
    private readonly redis: RedisService,
  ) { }

  async createItinerary(itineraryDTO: ItineraryDTO): Promise<Itinerary> {
    try {
      const conflictingItinerary = await this.itineraryRepository.findOne({
        where: [
          {
            busId: itineraryDTO.busId,
            departureDate: LessThanOrEqual(itineraryDTO.departureDate),
            arrivalDate: MoreThanOrEqual(itineraryDTO.departureDate),
          },
          {
            busId: itineraryDTO.busId,
            departureDate: LessThanOrEqual(itineraryDTO.arrivalDate),
            arrivalDate: MoreThanOrEqual(itineraryDTO.arrivalDate),
          },
        ],
      });
      if (conflictingItinerary !== null) {
        throw new Error('itinerary conflicts with an existing one');
      }
      const bus = await this.busRepository.findOne({
        where: { id: itineraryDTO.busId },
        select: ['capacity'],
      });
      if (bus === null) {
        throw new Error('bus does not exist');
      }
      itineraryDTO.capacity = bus.capacity;
      const newItinerary = this.itineraryRepository.create(itineraryDTO);
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

  // TODO: actualizarItinerarios? idealmente notificar al usuario mediante SES
  // buscar nomás todas las reservas con tal itineraryId porque actualizar
  // itinerarios no es tan común

  /*
    Notar que este endpoint puede devolver itinerarios que estén llenos. Sin embargo,
    creo que eso es deseable, ya que a veces uno está interesado en unirse a la lista
    de espera.
  */
  private async getValidItineraries() {
    try {
      return await this.itineraryRepository.find({
        where: { departureDate: MoreThan(new Date()) },
      });
    } catch (error) {
      this.logger.error(
        `error getting valid itineraries: ${stringifyError(error)}`,
      );
      throw new HttpException(
        'error getting valid itineraries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addItineraryToShoppingCart(
    sessionId: string,
    existingSession: ClientSession,
    dto: AddItineraryToShoppingCartDTO,
  ) {
    // TODO: basePrice * seatPercentage
    const found = existingSession.shoppingCart.find(
      (item) => item.itineraryId === dto.itineraryId,
    );
    if (found !== undefined) {
      throw new HttpException(
        'cannot add itinerary twice',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const itinerary = await this.itineraryRepository.findOne({
        where: { id: dto.itineraryId },
        select: ['busId', 'capacity'],
      });
      if (itinerary === null) {
        this.logger.warn(
          `user tried to add non-existent itinerary to shopping cart}`,
        );
        throw new HttpException(
          'itinerary does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      if (itinerary.capacity[dto.seatType] === 0) {
        throw new HttpException(
          'Bus capacity for that seat is full!',
          HttpStatus.CONFLICT,
        );
      }
      await this.redis.addToShoppingCart({
        sessionId,
        existingSession,
        item: {
          itineraryId: dto.itineraryId,
          seatType: dto.seatType,
          busId: itinerary.busId,
        },
      });
    } catch (error) {
      this.logger.error(
        `error adding itinerary to shopping cart: ${stringifyError(error)}`,
      );
      throw new HttpException(
        'error getting valid itineraries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteItineraryFromShoppingCart(
    sessionId: string,
    existingSession: ClientSession,
    itineraryId: string,
  ) {
    try {
      await this.redis.removeItemFromShoppingCart({
        sessionId,
        existingSession,
        itineraryId,
      });
    } catch (error) {
      this.logger.error(
        `error adding itinerary to shopping cart: ${stringifyError(error)}`,
      );
      throw new HttpException(
        'error getting valid itineraries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getItinerariesByCity(
    dto: GetItinerariesByCityDTO,
  ): Promise<Itinerary[]> {
    try {
      this.logger.log(`dto: ${JSON.stringify(dto, null, 2)}`);
      if (!dto || (!dto.cityOfOrigin && !dto.cityOfDestination)) {
        return await this.getValidItineraries();
      }
      const currentDate = new Date();
      const queryObj: GetItinerariesByCityDTO = {};
      if (dto.cityOfDestination) {
        queryObj.cityOfDestination = dto.cityOfDestination;
      }
      if (dto.cityOfOrigin) {
        queryObj.cityOfOrigin = dto.cityOfOrigin;
      }

      return await this.itineraryRepository.find({
        where: {
          ...queryObj,
          departureDate: MoreThan(currentDate),
        },
      });
    } catch (error) {
      this.logger.error(
        `error getting itineraries by city: ${stringifyError(error)}`,
      );
      throw new HttpException(
        GET_ITINERARIES_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
