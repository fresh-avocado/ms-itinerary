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
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBusByIdDTO } from './dtos/getBusById.dto';

@ApiCookieAuth('sessionId')
@ApiTags('bus')
@Controller('buses')
export class BusesController {
  constructor(private readonly busService: BusesService) {}

  @ApiOperation({ summary: 'Creates a bus.' })
  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Post('/create')
  @UsePipes(ValidationPipe)
  async create(@Body() busDTO: BusDTO) {
    const bus = await this.busService.createBus(busDTO);
    return { busId: bus.id };
  }

  // @UsePipes(ValidationPipe)

  @ApiOperation({ summary: 'Gets a bus.' })
  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Post('/getById')
  async getById(@Body() dto: GetBusByIdDTO) {
    return await this.busService.getById(dto.id);
  }

  @ApiOperation({ summary: 'Gets all buses.' })
  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Get('/all')
  async getAll() {
    return await this.busService.getAllBuses();
  }

  @ApiOperation({
    summary: 'Updates the capacity of a specific seat type in a bus.',
  })
  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Put('/updateCapacity')
  async updateSeatCapacity(@Body() updateSeatDTO: UpdateSeatDTO) {
    await this.busService.updateSeatCapacity(updateSeatDTO);
    return {};
  }

  @ApiOperation({ summary: 'Deletes a bus.' })
  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Delete('/delete')
  async deleteBus(@Body() deleteBusDTO: DeleteBusDTO) {
    await this.busService.deleteBus(deleteBusDTO);
    return {};
  }
}
