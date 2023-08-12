import { BusSeatType } from 'src/buses/enums/busSeatType.enum';

export type ShoppingCartItem = {
  itineraryId: string;
  busId: string;
  seatType: BusSeatType;
};
