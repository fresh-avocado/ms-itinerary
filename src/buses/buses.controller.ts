import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BusDTO } from './dtos/bus.dto';
import { BusesService } from './buses.service';
import { AllowedUserType } from 'src/guards/auth/decorators/role.decorator';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UpdateSeatDTO } from './dtos/updateSeat.dto';
import { DeleteBusDTO } from './dtos/deleteBus.dto';

@Controller('buses')
export class BusesController {
  constructor(private readonly busService: BusesService) {}

  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Post('/create')
  @UsePipes(ValidationPipe)
  async create(@Body() busDTO: BusDTO) {
    const bus = await this.busService.createBus(busDTO);
    return { busId: bus.id };
  }

  // @UsePipes(ValidationPipe)
  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Post('/getById')
  async getById(@Body() { id }: { id: string }) {
    return await this.busService.getById(id);
  }

  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Get('/all')
  async getAll() {
    return await this.busService.getAllBuses();
  }

  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Put('/updateCapacity')
  async updateSeatCapacity(@Body() updateSeatDTO: UpdateSeatDTO) {
    await this.busService.updateSeatCapacity(updateSeatDTO);
    return {};
  }

  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Delete('/delete')
  async deleteBus(@Body() deleteBusDTO: DeleteBusDTO) {
    await this.busService.deleteBus(deleteBusDTO);
    return {};
  }
}
