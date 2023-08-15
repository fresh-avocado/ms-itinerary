import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteBusDTO {
  @ApiProperty({
    description: 'ID of the bus we wish to delete',
  })
  @IsUUID()
  id: string;
}
