import { IsEnum, IsObject, IsString, Length, Matches } from 'class-validator';
import { Operator } from '../enums/operator.enum';
import { IsValidCapacity } from '../decorators/validCapacity.decorator';
import { BusSeatCapacity } from '../entities/bus.entity';

export class BusDTO {
  @IsString()
  @Length(7, 7)
  @Matches(/[A-Z]{1}[A-Z0-9]{2}\-[0-9]{3}/, {
    message: 'La placa tiene un formato inválido',
  })
  licensePlate: string;

  @IsEnum(Operator)
  operator: Operator;

  @IsObject()
  @IsValidCapacity({
    minCapacity: 20,
    maxCapacity: 35,
    message:
      'Los buses deben tener asientos de tipo TURISTA, EJECUTIVO y PREMIUM. Además, cada uno debe tener 20 asientos como mínimo y 35 como máximo',
  })
  capacity: BusSeatCapacity;
}
