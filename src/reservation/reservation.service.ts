import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { stringifyError } from 'src/utils/stringifyError';
import { Itinerary } from 'src/itinerary/entities/itinerary.entity';
import { ClientSession } from 'src/redis/types/session.type';
import { DeleteReservationDTO } from './dtos/deleteReservation.dto';
import { RedisService } from 'src/redis/redis.service';
import { GetReservationsDTO } from './dtos/getReservations.dto';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly redisService: RedisService,
  ) { }

  async makeReservations(
    sessionId: string,
    session: ClientSession,
  ): Promise<Reservation[]> {
    const shoppingCart = session.shoppingCart;
    if (shoppingCart.length === 0) {
      throw new HttpException(
        { msg: 'Empty shopping cart' },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const currentDate = new Date();
      let madeReservations: Reservation[];
      await this.reservationRepository.manager.transaction(
        async (entityManager) => {
          const reservations: Reservation[] = [];
          for (const item of shoppingCart) {
            const itinerary = await entityManager.findOne(Itinerary, {
              where: { id: item.itineraryId },
            });
            if (currentDate >= itinerary.departureDate) {
              entityManager.queryRunner.rollbackTransaction();
              throw new HttpException(
                {
                  msg: `Lo sentimos, el itinerario (${itinerary.cityOfOrigin}-${itinerary.cityOfDestination}) que usted trató de reservar ya partió.`,
                },
                HttpStatus.BAD_REQUEST,
              );
            }
            if (itinerary === null) {
              entityManager.queryRunner.rollbackTransaction();
              throw new HttpException(
                {
                  msg: 'Lo sentimos, el itinerario que usted trató de reservar ya no existe. Probablemente fue cancelado.',
                },
                HttpStatus.NOT_FOUND,
              );
            }
            if (itinerary.capacity[item.seatType] === 0) {
              entityManager.queryRunner.rollbackTransaction();
              throw new HttpException(
                {
                  msg: `Lo sentimos, no hay más asientos de tipo ${item.seatType} para el bus de ${itinerary.cityOfOrigin}-${itinerary.cityOfDestination}`,
                },
                HttpStatus.CONFLICT,
              );
            }
            await entityManager.update(Itinerary, item.itineraryId, {
              capacity: {
                ...itinerary.capacity,
                [item.seatType]: itinerary.capacity[item.seatType] - 1,
              },
            });
            const reservation = entityManager.create(Reservation, {
              userEmail: session.userEmail,
              busId: item.busId,
              itineraryId: item.itineraryId,
            });
            reservations.push(reservation);
          }
          madeReservations = await entityManager.save(reservations);
        },
      );
      // no necesario manejar su caso de error:
      this.redisService.resetShoppingCart({
        sessionId,
        existingSession: session,
      });
      return madeReservations;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `shopping cart reservations could not be made: ${stringifyError(
          error,
        )}`,
      );
      throw new HttpException(
        { msg: 'shopping cart reservations could not be made' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteReservation(dto: DeleteReservationDTO): Promise<void> {
    try {
      await this.reservationRepository.manager.transaction(
        async (entityManager) => {
          const delRes = await entityManager.delete(
            Reservation,
            dto.reservationId,
          );
          if (delRes.affected === 0) {
            entityManager.queryRunner.rollbackTransaction();
            throw new HttpException(
              { msg: 'La reserva ya fue borrada.' },
              HttpStatus.NOT_FOUND,
            );
          }
          const itinerary = await entityManager.findOne(Itinerary, {
            where: { id: dto.itineraryId },
          });
          if (itinerary === null) {
            entityManager.queryRunner.rollbackTransaction();
            throw new HttpException(
              {
                msg: 'Lo sentimos, el itinerario que usted trató de borrar ya no existe. Probablemente fue cancelado. Será reembolsado en la brevedad de lo posible. Revise su correo para más detalles.',
              },
              HttpStatus.NOT_FOUND,
            );
          }
          await entityManager.update(Itinerary, dto.itineraryId, {
            capacity: {
              ...itinerary.capacity,
              [dto.seatType]: itinerary.capacity[dto.seatType] + 1,
            },
          });
        },
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `could not delete reservation: ${stringifyError(error)}`,
      );
      throw new HttpException(
        { msg: 'Could not delete reservation' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(dto: GetReservationsDTO): Promise<Reservation[]> {
    try {
      if (!dto || (!dto.busId && !dto.itineraryId && !dto.userEmail)) {
        return await this.reservationRepository.find();
      }
      const queryObj: GetReservationsDTO = {};
      if (dto.busId) {
        queryObj.busId = dto.busId;
      }
      if (dto.itineraryId) {
        queryObj.itineraryId = dto.itineraryId;
      }
      if (dto.userEmail) {
        queryObj.userEmail = dto.userEmail;
      }
      return await this.reservationRepository.find({ where: queryObj });
    } catch (error) {
      this.logger.error(`could not get reservations: ${stringifyError(error)}`);
      throw new HttpException(
        { msg: 'Could not get reservations' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
