import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FindPlaylistQueryDto {
  @ApiProperty({
    example: "São Paulo",
  })
  @IsString()
  @IsNotEmpty()
  city: string;
}
