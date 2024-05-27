import { IsNotEmpty, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class FindPlaylistQueryDto {
  @ApiProperty({
    example: "São Paulo",
  })
  @IsString()
  @IsNotEmpty()
  city: string;
}
