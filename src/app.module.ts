import { WinstonModule } from "nest-winston";
import { format, transports } from "winston";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { OpenWeatherModule } from "./helpers/open-weather";
import { RedisModule } from "./helpers/redis";
import { PlaylistModule } from "./modules/playlist/playlist.module";
import { SpotifyModule } from "./modules/spotify/spotify.module";

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => ({
        exitOnError: false,
        format: format.json(),
        transports: [
          new transports.Console({
            format: format.combine(
              format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
              }),
              format.json()
            ),
          }),
        ],
      }),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PlaylistModule,
    OpenWeatherModule,
    SpotifyModule,
    RedisModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
