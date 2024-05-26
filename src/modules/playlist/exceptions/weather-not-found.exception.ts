import { BadRequestException } from "@nestjs/common";

export class WeatherNotFoundException extends BadRequestException {
  constructor() {
    super({
      message: "Weather not found",
      code: "WEATHER_NOT_FOUND",
    });
  }
}
