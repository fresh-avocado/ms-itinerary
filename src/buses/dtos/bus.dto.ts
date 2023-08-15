import { IsEnum, IsObject, IsString, Length, Matches } from 'class-validator';
import { Operator } from '../enums/operator.enum';
import { IsValidCapacity } from '../decorators/validCapacity.decorator';
import { BusSeatCapacity } from '../entities/bus.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BusDTO {
  @ApiProperty({
    description: "License plate of the bus in Peru's format",
    example: 'AHW-421',
  })
  @IsString()
  @Length(7, 7)
  @Matches(/[A-Z]{1}[A-Z0-9]{2}\-[0-9]{3}/, {
    message: 'La placa tiene un formato inválido',
  })
  licensePlate: string;

  @ApiProperty({
    description: 'Operator (company) that operates the bus',
    enum: [
      Operator.CRUZ_DEL_SUR,
      Operator.FLORES,
      Operator.OLTURSA,
      Operator.PALOMINO,
      Operator.SOYUZ,
      Operator.TEPSA,
    ],
  })
  @IsEnum(Operator)
  operator: Operator;

  @ApiProperty({
    description: 'Number of seats available on the bus',
  })
  @IsObject()
  @IsValidCapacity({
    minCapacity: 20,
    maxCapacity: 35,
    message:
      'Los buses deben tener asientos de tipo TURISTA, EJECUTIVO y PREMIUM. Además, cada uno debe tener 20 asientos como mínimo y 35 como máximo',
  })
  capacity: BusSeatCapacity;
}
