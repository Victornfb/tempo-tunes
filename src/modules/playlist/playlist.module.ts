import { Global, Module } from "@nestjs/common";
import { OpenWeatherService } from "@src/helpers/open-weather";

import { SpotifyService } from "../spotify/spotify.service";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";

@Global()
@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, OpenWeatherService, SpotifyService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
