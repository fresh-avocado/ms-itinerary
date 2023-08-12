import { UserType } from 'src/users/enums/userType';
import { ShoppingCartItem } from './shoppingCartItem.type';

export type ClientSession = {
  userEmail: string;
  userType: UserType;
  shoppingCart?: ShoppingCartItem[];
};
