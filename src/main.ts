import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe, Logger } from "@nestjs/common";
import { json, urlencoded } from "express";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create(AppModule, {
    logger: ["debug", "error", "warn", "log", "verbose"],
  });

  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ limit: "10mb", extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("UNIMET Lab API")
    .setDescription("API del Laboratorio de Procesos de Separación - UNIMET")
    .setVersion("1.0")
    .addTag("auth")
    .addTag("users")
    .addTag("reagents")
    .addTag("materials")
    .addTag("equipments")
    .addTag("reservations")
    .addTag("manuals")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`UNIMET Lab API corriendo en puerto ${port}`);
}
bootstrap();
