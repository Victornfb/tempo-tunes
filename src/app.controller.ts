import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Public } from "./decorators/public.decorator";

@ApiTags("Health Check")
@Controller()
export class AppController {
  @ApiOperation({
    summary: "Checa se a API está sendo executada",
    description: "Checa se a API está sendo executada.",
  })
  @ApiOkResponse({
    description: "Se a API estiver sendo executada",
    content: {
      "text/html": {
        example: "Heart beat!",
      },
    },
  })
  @Public()
  @Get()
  ok(): string {
    return "Heart beat!";
  }
}
