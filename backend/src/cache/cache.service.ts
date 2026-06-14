import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

@Injectable()
export class CacheService {
  private redis: Redis | null = null;
  private readonly logger = new Logger(CacheService.name);
  private readonly ttl: number;

  constructor(private config: ConfigService) {
    const rawUrl = this.config.get('REDIS_URL');
    this.ttl = Number(this.config.get('CACHE_TTL')) || 60;
    if (rawUrl) {
      try {
        const parsed = new URL(rawUrl);
        const token = parsed.username || this.config.get('UPSTASH_TOKEN') || '';
        const url = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
        this.redis = new Redis({ url, token });
      } catch {
        this.logger.warn('Invalid REDIS_URL — running without cache');
      }
    } else {
      this.logger.log('No REDIS_URL — running without cache');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    try {
      const val = await this.redis.get(key);
      return val as T | null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!this.redis) return;
    try {
      const seconds = ttl || this.ttl;
      if (seconds) {
        await this.redis.setex(key, seconds, value);
      } else {
        await this.redis.set(key, value);
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
}
