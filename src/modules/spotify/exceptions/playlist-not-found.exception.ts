import { BadRequestException } from "@nestjs/common";

export class PlaylistNotFoundException extends BadRequestException {
  constructor() {
    super({
      message: "Playlist not found",
      code: "PLAYLIST_NOT_FOUND",
    });
  }
}
