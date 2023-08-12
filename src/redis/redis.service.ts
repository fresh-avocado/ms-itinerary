import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { RedisClient } from './redis.module';
import { REDIS_CLIENT, SESSION_EXPIRATION_TIME } from './constants/constants';
import { ClientSession } from './types/session.type';
import { stringifyError } from 'src/utils/stringifyError';
import {
  GET_SESSION_ERROR,
  NOT_SIGNED_IN,
} from 'src/utils/constants/errorMessages';
import { ShoppingCartItem } from './types/shoppingCartItem.type';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}

  async getSession(key: string): Promise<ClientSession> {
    let res: string | null;
    try {
      res = await this.redis.get(key);
    } catch (error) {
      this.logger.error(`could not get session: ${stringifyError(error)}`);
      throw new HttpException(
        { msg: GET_SESSION_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (res === null) {
      throw new HttpException({ msg: NOT_SIGNED_IN }, HttpStatus.FORBIDDEN);
    }
    return JSON.parse(res) as ClientSession;
  }

  private async setSession(key: string, value: ClientSession): Promise<void> {
    try {
      await this.redis
        .multi()
        .set(key, JSON.stringify(value), { EX: SESSION_EXPIRATION_TIME })
        .set(value.userEmail, key, { EX: SESSION_EXPIRATION_TIME })
        .exec();
    } catch (error) {
      this.logger.error(`could not set user session: ${stringifyError(error)}`);
      throw new Error('could not set user session');
    }
  }

  async addToShoppingCart({
    sessionId,
    existingSession,
    item,
  }: {
    sessionId: string;
    existingSession: ClientSession;
    item: ShoppingCartItem;
  }): Promise<void> {
    existingSession.shoppingCart.push(item);
    await this.setSession(sessionId, existingSession);
  }

  async removeItemFromShoppingCart({
    sessionId,
    existingSession,
    itineraryId,
  }: {
    sessionId: string;
    existingSession: ClientSession;
    itineraryId: string;
  }): Promise<void> {
    existingSession.shoppingCart = existingSession.shoppingCart.filter(
      (item) => item.itineraryId !== itineraryId,
    );
    await this.setSession(sessionId, existingSession);
  }

  onModuleDestroy() {
    this.redis.quit();
  }
}
