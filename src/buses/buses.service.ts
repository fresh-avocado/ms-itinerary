import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { Repository } from 'typeorm';
import { BusDTO } from './dtos/bus.dto';
import { stringifyError } from 'src/utils/stringifyError';
import {
  CREATE_BUS_ERROR,
  DELETE_BUS_ERROR,
  FORBIDDEN_BUS_CAPACITY_ERROR,
  GET_BUSES_ERROR,
  GET_BUS_ERROR,
  NON_EXISTENT_BUS_ERROR,
  UPDATE_SEAT_CAPACITY_ERROR,
} from 'src/utils/constants/errorMessages';
import { UpdateSeatDTO } from './dtos/updateSeat.dto';
import { BusSeatType } from './enums/busSeatType.enum';
import {
  MAX_BUS_SEAT_CAPACITY,
  MIN_BUS_SEAT_CAPACITY,
} from './constants/constants';
import { DeleteBusDTO } from './dtos/deleteBus.dto';

@Injectable()
export class BusesService {
  private readonly logger = new Logger(BusesService.name);

  constructor(
    @InjectRepository(Bus) private readonly busRepository: Repository<Bus>,
  ) {}

  async createBus(busDTO: BusDTO): Promise<Bus> {
    try {
      const newBus = this.busRepository.create(busDTO);
      const savedBus = await this.busRepository.save(newBus);
      return savedBus;
    } catch (error) {
      this.logger.error(`error creating user: ${stringifyError(error)}`);
      throw new HttpException(
        CREATE_BUS_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(id: string): Promise<Bus> {
    let bus: Bus | null;
    try {
      bus = await this.busRepository.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(`error finding bus: ${stringifyError(error)}`);
      throw new HttpException(GET_BUS_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (bus === null) {
      throw new HttpException(
        { msg: NON_EXISTENT_BUS_ERROR },
        HttpStatus.BAD_REQUEST,
      );
    }
    return bus;
  }

  async getAllBuses(): Promise<Bus[]> {
    try {
      return await this.busRepository.find();
    } catch (error) {
      this.logger.error(`error finding buses: ${stringifyError(error)}`);
      throw new HttpException(
        GET_BUSES_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSeatCapacity(updateSeatDTO: UpdateSeatDTO): Promise<void> {
    const bus = await this.getById(updateSeatDTO.id);
    if (bus.capacity[updateSeatDTO.seat] === updateSeatDTO.capacity) {
      // no need to do superfluous update
      return;
    }
    bus.capacity[updateSeatDTO.seat] = updateSeatDTO.capacity;
    const newSeatCount =
      bus.capacity[BusSeatType.TOURIST] +
      bus.capacity[BusSeatType.EXECUTIVE] +
      bus.capacity[BusSeatType.PREMIUM];
    if (
      newSeatCount < MIN_BUS_SEAT_CAPACITY ||
      newSeatCount > MAX_BUS_SEAT_CAPACITY
    ) {
      throw new HttpException(
        {
          msg: FORBIDDEN_BUS_CAPACITY_ERROR,
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    try {
      await this.busRepository.update(updateSeatDTO.id, {
        capacity: {
          ...bus.capacity,
          [updateSeatDTO.seat]: updateSeatDTO.capacity,
        },
      });
    } catch (error) {
      this.logger.error(
        `error updating seat capacity: ${stringifyError(error)}`,
      );
      throw new HttpException(
        UPDATE_SEAT_CAPACITY_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteBus(deleteBusDTO: DeleteBusDTO) {
    try {
      await this.busRepository.delete(deleteBusDTO.id);
    } catch (error) {
      this.logger.error(`error deleting bus: ${stringifyError(error)}`);
      throw new HttpException(
        DELETE_BUS_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
