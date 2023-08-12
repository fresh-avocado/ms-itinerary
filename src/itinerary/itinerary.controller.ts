import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AllowedUserType } from 'src/guards/auth/decorators/role.decorator';
import { ItineraryService } from './itinerary.service';
import { ItineraryDTO } from './dtos/itinerary.dto';
import { AddItineraryToShoppingCartDTO } from './dtos/addItineraryToShoppingCart.dto';
import { FastifyRequest } from 'fastify';
import { ClientSession } from 'src/redis/types/session.type';
import { DeleteItineraryFromShoppingCartDTO } from './dtos/deleteItineraryFromShoppingCart.dto';

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

  @AllowedUserType('any')
  @UseGuards(AuthGuard)
  @Get('/allValid')
  @UsePipes(ValidationPipe)
  async getAllValid() {
    return await this.itineraryService.getValidItineraries();
  }

  @AllowedUserType('normal')
  @UseGuards(AuthGuard)
  @Put('/addToShoppingCart')
  @UsePipes(ValidationPipe)
  async addItineraryToShoppingCart(
    @Body() dto: AddItineraryToShoppingCartDTO,
    @Req() req: FastifyRequest & { sessionId: string; session: ClientSession },
  ) {
    await this.itineraryService.addItineraryToShoppingCart(
      req.sessionId,
      req.session,
      dto,
    );
    return {};
  }

  @AllowedUserType('normal')
  @UseGuards(AuthGuard)
  @Delete('/removeFromShoppingCart')
  @UsePipes(ValidationPipe)
  async deleteItineraryFromShoppingCart(
    @Body() dto: DeleteItineraryFromShoppingCartDTO,
    @Req() req: FastifyRequest & { sessionId: string; session: ClientSession },
  ) {
    await this.itineraryService.deleteItineraryFromShoppingCart(
      req.sessionId,
      req.session,
      dto.itineraryId,
    );
    return {};
  }
}
