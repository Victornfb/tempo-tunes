import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { RedisService } from "../redis";
import { OpenWeatherService } from "./open-weather.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [OpenWeatherService, RedisService],
  exports: [OpenWeatherService],
})
export class OpenWeatherModule {}
