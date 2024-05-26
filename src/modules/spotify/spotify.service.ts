import axios, { AxiosInstance } from "axios";

import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Category } from "./dto/category.dto";
import { Playlist } from "./dto/playlist.dto";
import { Track } from "./dto/track.dto";
import { CategoryNotFoundException } from "./exceptions/category-not-found.exception";
import { PlaylistNotFoundException } from "./exceptions/playlist-not-found.exception";

@Injectable()
export class SpotifyService {
  private instance: AxiosInstance;
  private accessToken: string;

  constructor(private configService: ConfigService) {}

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
    }

    return this.instance;
  }

  async getToken(): Promise<string> {
    try {
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

      return response?.data?.access_token;
    } catch (error) {
      Logger.error(error);
    }
  }

  async getCategories(page = 1, limit = 50): Promise<Category[]> {
    try {
      const spotifyApi = await this.getInstance();

      const response = await spotifyApi.get(`/browse/categories`, {
        params: {
          locale: "pt_BR",
          limit,
          offset: (page - 1) * limit,
        },
      });

      return response?.data?.categories?.items as Category[];
    } catch (error) {
      Logger.error(error);
    }
  }

  async getPlaylistsByCategory(
    categoryId: string,
    page = 1,
    limit = 10
  ): Promise<Playlist[]> {
    try {
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

      return response?.data?.playlists?.items as Playlist[];
    } catch (error) {
      Logger.error(error);
    }
  }

  async getPlaylistItems(
    playlistId: string,
    page = 1,
    limit = 10
  ): Promise<Array<{ name: string; artist: string }>> {
    try {
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

      return updatedItems;
    } catch (error) {
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
