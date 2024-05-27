import axios, { AxiosInstance } from "axios";

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Geolocation } from "@src/@types/geolocation";
import { Weather } from "@src/@types/weather";

import { RedisService } from "../redis";

@Injectable()
export class OpenWeatherService {
  private instance: AxiosInstance;

  private GEOLOCATION_CACHE_TTL = 60 * 60 * 24 * 7; // 7 days
  private WEATHER_CACHE_TTL = 60 * 60; // 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly redis: RedisService
  ) {}

  getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: this.configService.get<string>("OPEN_WEATHER_BASE_URL"),
      });
    }

    return this.instance;
  }

  async getGeolocationByCity(city: string): Promise<Geolocation> {
    try {
      const cachedData = await this.redis.get(city);

      if (cachedData) {
        return JSON.parse(cachedData) as Geolocation;
      }

      const response = await this.getInstance().get("geo/1.0/direct", {
        params: {
          q: city,
          limit: 1,
          appid: this.configService.get<string>("OPEN_WEATHER_API_KEY"),
        },
      });

      await this.redis.set(
        city,
        JSON.stringify(response?.data?.[0]),
        this.GEOLOCATION_CACHE_TTL
      );

      return response?.data?.[0] as Geolocation;
    } catch (error) {
      Logger.error(error);
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<Weather> {
    try {
      const key = `${lat},${lon}`;

      const cachedData = await this.redis.get(key);

      if (cachedData) {
        return JSON.parse(cachedData) as Weather;
      }

      const response = await this.getInstance().get("data/3.0/onecall", {
        params: {
          lat,
          lon,
          units: "metric",
          exclude: "minutely,hourly,daily,alerts",
          appid: this.configService.get<string>("OPEN_WEATHER_API_KEY"),
        },
      });

      await this.redis.set(
        key,
        JSON.stringify(response?.data),
        this.WEATHER_CACHE_TTL
      );

      return response?.data as Weather;
    } catch (error) {
      Logger.error(error);
    }
  }
}
