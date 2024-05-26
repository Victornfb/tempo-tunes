import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Geolocation } from "@src/@types/geolocation";
import { Weather } from "@src/@types/weather";
import axios, { AxiosInstance } from "axios";

export class OpenWeatherHelper {
  private static instance: AxiosInstance;
  private static configService = new ConfigService();

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: this.configService.get<string>("OPEN_WEATHER_BASE_URL"),
      });
    }

    return this.instance;
  }

  static async getGeolocationByCity(city: string): Promise<Geolocation> {
    try {
      const response = await this.getInstance().get("geo/1.0/direct", {
        params: {
          q: city,
          limit: 1,
          appid: this.configService.get<string>("OPEN_WEATHER_API_KEY"),
        },
      });

      return response?.data?.[0] as Geolocation;
    } catch (error) {
      Logger.error(error);
    }
  }

  static async getWeatherByCoordinates(
    lat: number,
    lon: number
  ): Promise<Weather> {
    try {
      const response = await this.getInstance().get("data/3.0/onecall", {
        params: {
          lat,
          lon,
          units: "metric",
          exclude: "minutely,hourly,daily,alerts",
          appid: this.configService.get<string>("OPEN_WEATHER_API_KEY"),
        },
      });

      return response?.data as Weather;
    } catch (error) {
      Logger.error(error);
    }
  }
}
