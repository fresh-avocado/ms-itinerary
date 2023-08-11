import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { RedisClient } from './redis.module';
import { REDIS_CLIENT } from './constants/constants';
import { ClientSession } from './types/session.type';
import { stringifyError } from 'src/utils/stringifyError';
import {
  GET_SESSION_ERROR,
  NOT_SIGNED_IN,
} from 'src/utils/constants/errorMessages';

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

  onModuleDestroy() {
    this.redis.quit();
  }
}
