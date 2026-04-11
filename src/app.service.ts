import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello() {
    return {
      status: "ok",
      service: "UNIMET Lab API - Laboratorio de Procesos de Separación",
    };
  }
}
