import { BadRequestException } from "@nestjs/common";

export class CityNotFoundException extends BadRequestException {
  constructor() {
    super({
      message: "City not found",
      code: "CITY_NOT_FOUND",
    });
  }
}
