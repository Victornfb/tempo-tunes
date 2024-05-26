import helmet from "helmet";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { ExceptionsFilter } from "./filters/exceptions.filter";
import { EntireSwaggerConfig } from "./swagger/entire.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "debug"],
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalFilters(new ExceptionsFilter());

  app.use(helmet());

  app.enableCors({
    origin: "*",
    allowedHeaders: "*",
    methods: "*",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  EntireSwaggerConfig.initialize(app);

  await app.listen(4000, async () =>
    Logger.log(`Application started at ${await app.getUrl()}`)
  );
}

bootstrap();
