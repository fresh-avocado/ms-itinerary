import { IsUUID } from 'class-validator';

export class DeleteBusDTO {
  @IsUUID()
  id: string;
}
