import { IsEnum, IsObject, IsString, Length, Matches } from 'class-validator';
import { Operator } from '../enums/operator.enum';

export class BusDTO {
  @IsString()
  @Length(6, 6)
  @Matches(/[A-Z]{1}[A-Z0-9]{2}\-[0-9]{3}/, {
    message: 'La placa tiene un formato inválido',
  })
  licensePlate: string;

  @IsEnum(Operator)
  operator: Operator;

  @IsObject()
  capacity: { [seatType: string]: number };
}
