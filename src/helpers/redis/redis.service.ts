import Redis from "ioredis";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService {
  private readonly instance: Redis;

  constructor(private readonly config: ConfigService) {
    this.instance = new Redis({
      host: this.config.get<string>("REDIS_HOST"),
      port: this.config.get<number>("REDIS_PORT"),
      password: this.config.get<string>("REDIS_PASSWORD"),
    });
  }

  async get(key: string): Promise<string> {
    return await this.instance.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<"OK"> {
    return await this.instance.set(key, value, "EX", ttl);
  }

  async del(key: string): Promise<number> {
    return await this.instance.del(key);
  }
}
