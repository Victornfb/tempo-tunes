import { Injectable } from "@nestjs/common";
import { OpenWeatherService } from "@src/helpers/open-weather";

import { SpotifyService } from "../spotify/spotify.service";
import { PlaylistResponseDTO } from "./dto/playlist-response.dto";
import { CityNotFoundException } from "./exceptions/city-not-found.exception";
import { WeatherNotFoundException } from "./exceptions/weather-not-found.exception";

@Injectable()
export class PlaylistService {
  constructor(
    private readonly openWeatherService: OpenWeatherService,
    private readonly spotifyService: SpotifyService
  ) {}

  async findByCity(city: string): Promise<object> {
    const geolocation = await this.openWeatherService.getGeolocationByCity(
      city
    );

    if (!geolocation?.lat && !geolocation?.lon) {
      throw new CityNotFoundException();
    }

    const weather = await this.openWeatherService.getWeatherByCoordinates(
      geolocation.lat,
      geolocation.lon
    );

    const temperature = weather?.current?.temp;

    if (!temperature) {
      throw new WeatherNotFoundException();
    }

    let categoryName = "Clássico";

    if (temperature > 25) {
      categoryName = "Pop";
    } else if (temperature >= 10 && temperature <= 25) {
      categoryName = "Rock";
    }

    const playlist = await this.spotifyService.getPlaylistByCategory(
      categoryName
    );

    return new PlaylistResponseDTO(
      geolocation.name,
      temperature,
      playlist.name,
      playlist.tracks
    );
  }
}
