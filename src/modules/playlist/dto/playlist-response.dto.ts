import { ApiProperty } from "@nestjs/swagger";

export class PlaylistResponseDTO {
  constructor(
    city: string,
    temperature: number,
    name: string,
    tracks: Array<{ name: string; artist: string }>
  ) {
    this.city = city;
    this.temperature = temperature;
    this.name = name;
    this.tracks = tracks;
  }

  @ApiProperty({
    example: "São Paulo",
  })
  city: string;

  @ApiProperty({
    example: 18.5,
    type: Number,
  })
  temperature: number;

  @ApiProperty({
    example: "Rock",
  })
  name: string;

  @ApiProperty({
    example: [
      {
        name: "Smoke on the water",
        artist: "Deep Purple",
      },
    ],
  })
  tracks: Array<{ name: string; artist: string }>;
}
