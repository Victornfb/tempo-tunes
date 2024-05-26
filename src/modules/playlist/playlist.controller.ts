import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Public } from "@src/decorators/public.decorator";

import { CategoryNotFoundException } from "../spotify/exceptions/category-not-found.exception";
import { PlaylistNotFoundException } from "../spotify/exceptions/playlist-not-found.exception";
import { FindPlaylistQueryDto } from "./dto/find-playlist-query.dto";
import { PlaylistResponseDTO } from "./dto/playlist-response.dto";
import { CityNotFoundException } from "./exceptions/city-not-found.exception";
import { WeatherNotFoundException } from "./exceptions/weather-not-found.exception";
import { PlaylistService } from "./playlist.service";

@ApiTags("Playlist")
@Controller("playlist")
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @ApiOperation({
    summary: "Busca uma playlist utilizando a temperatura da cidade",
    description: "Busca uma playlist utilizando a temperatura da cidade.",
  })
  @ApiOkResponse({
    description: "Caso seja retornada a playlist.",
    type: PlaylistResponseDTO,
  })
  @ApiBadRequestResponse({
    description: "Caso não seja retornada a playlist.",
    content: {
      "application/json": {
        examples: {
          "Cidade não encontrada": {
            value: new CityNotFoundException().getResponse(),
          },
          "Temperatura não encontrada": {
            value: new WeatherNotFoundException().getResponse(),
          },
          "Categoria não encontrada": {
            value: new CategoryNotFoundException().getResponse(),
          },
          "Playlist não encontrada": {
            value: new PlaylistNotFoundException().getResponse(),
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Caso ocorra um erro interno.",
    schema: {
      example: new InternalServerErrorException().getResponse(),
    },
  })
  @Public()
  @Get("city/temperature")
  async findByCity(@Query() query: FindPlaylistQueryDto): Promise<object> {
    const { city } = query;
    return await this.playlistService.findByCity(city);
  }
}
