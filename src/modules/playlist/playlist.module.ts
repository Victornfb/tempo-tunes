import { Global, Module } from "@nestjs/common";

import { SpotifyService } from "../spotify/spotify.service";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";

@Global()
@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, SpotifyService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
