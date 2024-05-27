import axios, { AxiosInstance } from "axios";

import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "@src/helpers/redis";

import { Category } from "@src/@types/category";
import { Playlist } from "@src/@types/playlist";
import { Track } from "@src/@types/track";
import { CategoryNotFoundException } from "./exceptions/category-not-found.exception";
import { PlaylistNotFoundException } from "./exceptions/playlist-not-found.exception";

@Injectable()
export class SpotifyService {
  private GENERAL_CACHE_TTL = 60 * 60; // 1 hour

  private ACCESS_TOKEN_CACHE_TTL = 60 * 60; // 1 hour
  private ACCESS_TOKEN_KEY = "spotify_access_token";

  private instance: AxiosInstance;
  private accessToken: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly redis: RedisService
  ) {}

  async getInstance(): Promise<AxiosInstance> {
    if (!this.accessToken) {
      this.accessToken = await this.getToken();
    }

    if (!this.instance) {
      this.instance = axios.create({
        baseURL: this.configService.get<string>("SPOTIFY_BASE_URL"),
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      this.instance.interceptors.response.use(undefined, async (error) => {
        if (error?.response?.status === 401) {
          this.accessToken = await this.getToken();
          error.config.headers.Authorization = `Bearer ${this.accessToken}`;
          return this.instance.request(error.config);
        }

        return Promise.reject(error);
      });
    }

    return this.instance;
  }

  async getToken(): Promise<string> {
    try {
      let token = await this.redis.get(this.ACCESS_TOKEN_KEY);

      if (token) return token;

      const clientId = this.configService.get<string>("SPOTIFY_CLIENT_ID");
      const clientSecret = this.configService.get<string>(
        "SPOTIFY_CLIENT_SECRET"
      );

      const response = await axios.post(
        `${this.configService.get<string>("SPOTIFY_ACCOUNTS_BASE_URL")}/token`,
        new URLSearchParams({
          grant_type: "client_credentials",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${clientId}:${clientSecret}`
            ).toString("base64")}`,
          },
        }
      );

      token = response?.data?.access_token;

      await this.redis.set(
        this.ACCESS_TOKEN_KEY,
        token,
        this.ACCESS_TOKEN_CACHE_TTL
      );

      return token;
    } catch (error) {
      Logger.error(error);
    }
  }

  async getCategories(page = 1, limit = 50): Promise<Category[]> {
    try {
      const cacheKey = `categories:${page}:${limit}`;

      const cacheResult = await this.redis.get(cacheKey);

      if (cacheResult) return JSON.parse(cacheResult);

      const spotifyApi = await this.getInstance();

      const response = await spotifyApi.get(`/browse/categories`, {
        params: {
          locale: "pt_BR",
          limit,
          offset: (page - 1) * limit,
        },
      });

      const categories = response?.data?.categories?.items as Category[];

      await this.redis.set(
        cacheKey,
        JSON.stringify(categories),
        this.GENERAL_CACHE_TTL
      );

      return categories;
    } catch (error: any) {
      Logger.error(error);
    }
  }

  async getPlaylistsByCategory(
    categoryId: string,
    page = 1,
    limit = 10
  ): Promise<Playlist[]> {
    try {
      const cacheKey = `playlists:${categoryId}:${page}:${limit}`;

      const cacheResult = await this.redis.get(cacheKey);

      if (cacheResult) return JSON.parse(cacheResult);

      const spotifyApi = await this.getInstance();

      const response = await spotifyApi.get(
        `/browse/categories/${categoryId}/playlists`,
        {
          params: {
            limit,
            offset: (page - 1) * limit,
          },
        }
      );

      const playlists = response?.data?.playlists?.items as Playlist[];

      await this.redis.set(
        cacheKey,
        JSON.stringify(playlists),
        this.GENERAL_CACHE_TTL
      );

      return playlists;
    } catch (error: any) {
      Logger.error(error);
    }
  }

  async getPlaylistItems(
    playlistId: string,
    page = 1,
    limit = 10
  ): Promise<Array<{ name: string; artist: string }>> {
    try {
      const cacheKey = `playlistItems:${playlistId}:${page}:${limit}`;

      const cacheResult = await this.redis.get(cacheKey);

      if (cacheResult) return JSON.parse(cacheResult);

      const spotifyApi = await this.getInstance();

      const response = await spotifyApi.get(`/playlists/${playlistId}/tracks`, {
        params: {
          market: "BR",
          limit,
          offset: (page - 1) * limit,
        },
      });

      const items = response?.data?.items as Track[];

      const updatedItems = items.map((item) => ({
        name: item?.track?.name,
        artist: item?.track?.artists?.[0]?.name,
      }));

      await this.redis.set(
        cacheKey,
        JSON.stringify(updatedItems),
        this.GENERAL_CACHE_TTL
      );

      return updatedItems;
    } catch (error: any) {
      Logger.error(error);
    }
  }

  async getPlaylistByCategory(categoryName: string): Promise<{
    name: string;
    tracks: {
      name: string;
      artist: string;
    }[];
  }> {
    try {
      let category: Category;

      for (let i = 1; i <= 3; i++) {
        const categories = await this.getCategories(i);

        category = categories.find(
          (category) =>
            categoryName.toLowerCase() === category.name.toLowerCase()
        );

        if (category) break;

        if (i === 3) throw new CategoryNotFoundException();
      }

      const playlists = await this.getPlaylistsByCategory(category.id);

      const playlist = playlists?.[0];

      if (!playlist) throw new PlaylistNotFoundException();

      const tracks = await this.getPlaylistItems(playlist.id);

      return {
        name: playlist.name,
        tracks,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      Logger.error(error);
    }
  }
}
