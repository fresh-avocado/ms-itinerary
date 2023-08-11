import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { Repository } from 'typeorm';
import { BusDTO } from './dtos/bus.dto';
import { stringifyError } from 'src/utils/stringifyError';
import { CREATE_BUS_ERROR } from 'src/utils/constants/errorMessages';

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
}
