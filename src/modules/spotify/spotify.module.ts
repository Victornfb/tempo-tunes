import { Module } from "@nestjs/common";

import { RedisService } from "@src/helpers/redis";
import { SpotifyService } from "./spotify.service";

@Module({
  providers: [SpotifyService, RedisService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
