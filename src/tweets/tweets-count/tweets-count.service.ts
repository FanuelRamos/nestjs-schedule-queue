import { Inject, Injectable } from '@nestjs/common';
import { Tweet } from '../entities/tweet.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Interval } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TweetsCountService {
  private limit = 10;
  constructor(
    @InjectModel(Tweet)
    private tweetModel: typeof Tweet,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectQueue('emails')
    private readonly emailQueue: Queue,
  ) {}

  @Interval(5000)
  async count() {
    console.log('Buscando tweets');
    let offset = await this.cacheManager.get<number>('tweet-offset');
    offset = offset === undefined ? 0 : offset;
    console.log(`Offset: ${offset}`);
    const tweets = await this.tweetModel.findAll({
      offset,
      limit: this.limit,
    });
    console.log(`Encontrados ${tweets.length} tweets`);
    if (tweets.length === this.limit) {
      this.cacheManager.set('tweet-offset', offset + this.limit, 60000);
      console.log(`Achou + ${this.limit} tweets`);
      this.emailQueue.add({ tweets: tweets.map((t) => t.toJSON()) });
    }
  }
}
