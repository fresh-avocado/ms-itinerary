import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BusDTO } from './dtos/bus.dto';
import { BusesService } from './buses.service';
import { AllowedUserType } from 'src/guards/auth/decorators/role.decorator';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('buses')
export class BusesController {
  constructor(private readonly busService: BusesService) {}

  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Post('/create')
  @UsePipes(ValidationPipe)
  async create(@Body() busDTO: BusDTO) {
    await this.busService.createBus(busDTO);
    return {};
  }
}
