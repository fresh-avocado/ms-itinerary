import {
  MAX_BUS_SEAT_CAPACITY,
  MIN_BUS_SEAT_CAPACITY,
} from 'src/buses/constants/constants';

export const WRONG_EMAIL_OR_PASSWORD = 'Wrong email or password';
export const NOT_SIGNED_IN = 'You need to log sign in';
export const MALFORMED_SESSION_COOKIE = 'Malformed session cookie';
export const UNAUTHORIZED = 'Unauthorized';
export const CREATE_SESSION_ERROR = 'Could not create session';
export const GET_SESSION_ERROR = 'Could not retrieve session';
export const GET_USERS_ERROR = 'Could get users';
export const GET_USER_ERROR = 'Could get user';
export const GET_BUS_ERROR = 'Could bus user';
export const GET_BUSES_ERROR = 'Could buses user';
export const CREATE_USER_ERROR = 'Could not create user';
export const CREATE_BUS_ERROR = 'Could not create bus';
export const NON_EXISTENT_USER_ERROR = 'User does not exist';
export const NON_EXISTENT_BUS_ERROR = 'Bus does not exist';
export const FORBIDDEN_BUS_CAPACITY_ERROR = `Bus capacity should not fall short of ${MIN_BUS_SEAT_CAPACITY} and should not exceed ${MAX_BUS_SEAT_CAPACITY}`;
export const UPDATE_SEAT_CAPACITY_ERROR = 'Could not update seat capacity';
export const DELETE_BUS_ERROR = 'Could not delete bus';
export const CREATE_ITINERARY_ERROR = 'Could not create itinerary';
export const GET_ITINERARIES_ERROR = 'Could not get itineraries';
export const GET_ITINERARIES_BY_CITY_ERROR =
  'Could not get itineraries by city';
