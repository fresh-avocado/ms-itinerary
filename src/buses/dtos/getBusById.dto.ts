import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBusByIdDTO {
  @ApiProperty({
    description: 'ID of the bus we wish to get',
  })
  @IsUUID()
  id: string;
}
