import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private redis: Redis | null = null;
  private readonly logger = new Logger(CacheService.name);
  private readonly ttl: number;

  constructor(private config: ConfigService) {
    const url = this.config.get('REDIS_URL');
    this.ttl = Number(this.config.get('CACHE_TTL')) || 60;
    if (url) {
      this.redis = new Redis(url, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 2000)),
        lazyConnect: true,
      });
      this.redis.on('error', (err) => this.logger.warn('Redis error:', err.message));
      this.redis.connect().catch(() => {
        this.redis = null;
        this.logger.warn('Redis unavailable — running without cache');
      });
    } else {
      this.logger.log('No REDIS_URL — running without cache');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    try {
      const val = await this.redis.get(key);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!this.redis) return;
    try {
      const str = JSON.stringify(value);
      if (ttl || this.ttl) {
        await this.redis.setex(key, ttl || this.ttl, str);
      } else {
        await this.redis.set(key, str);
      }
    } catch {}
  }

  async del(pattern: string): Promise<void> {
    if (!this.redis) return;
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length) await this.redis.del(...keys);
    } catch {}
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}
