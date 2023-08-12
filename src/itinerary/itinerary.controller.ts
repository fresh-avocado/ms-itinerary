import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AllowedUserType } from 'src/guards/auth/decorators/role.decorator';
import { ItineraryService } from './itinerary.service';
import { ItineraryDTO } from './dtos/itinerary.dto';

@Controller('itinerary')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Post('/create')
  @UsePipes(ValidationPipe)
  async create(@Body() itineraryDTO: ItineraryDTO) {
    await this.itineraryService.createItinerary(itineraryDTO);
    return {};
  }

  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Get('/all')
  @UsePipes(ValidationPipe)
  async getAll() {
    return await this.itineraryService.getAllItineraries();
  }
}
