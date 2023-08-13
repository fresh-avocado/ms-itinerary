import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AllowedUserType } from 'src/guards/auth/decorators/role.decorator';
import { ClientSession } from 'src/redis/types/session.type';
import { ReservationService } from './reservation.service';
import { DeleteReservationDTO } from './dtos/deleteReservation.dto';
import { GetReservationsDTO } from './dtos/getReservations.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @AllowedUserType('normal')
  @UseGuards(AuthGuard)
  @Post('/make')
  async makeReservation(
    @Req() req: FastifyRequest & { session: ClientSession; sessionId: string },
  ) {
    return await this.reservationService.makeReservations(
      req.sessionId,
      req.session,
    );
  }

  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @Post('/all')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async getAll(@Body() dto: GetReservationsDTO) {
    return await this.reservationService.getAll(dto);
  }

  @AllowedUserType('any')
  @UseGuards(AuthGuard)
  @Delete('/delete')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async deleteReservation(@Body() dto: DeleteReservationDTO) {
    await this.reservationService.deleteReservation(dto);
    return {};
  }
}
