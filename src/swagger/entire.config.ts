import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export class EntireSwaggerConfig {
  private static getEntireSwaggerConfig() {
    return new DocumentBuilder()
      .setTitle("Tempo Tunes")
      .setDescription("A playlist perfeita para cada temperatura")
      .setVersion("1.0")
      .build();
  }

  static initialize(app: INestApplication) {
    const document = SwaggerModule.createDocument(
      app,
      EntireSwaggerConfig.getEntireSwaggerConfig()
    );

    SwaggerModule.setup("/docs", app, document, {
      customSiteTitle: "TempoTunes API",
    });
  }
}
