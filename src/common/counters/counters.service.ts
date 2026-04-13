import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { Counter } from "./counter.entity";

/**
 * Genera códigos secuenciales atómicamente usando findOneAndUpdate con $inc.
 * Format: PREFIX-0001, PREFIX-0002, etc.
 */
@Injectable()
export class CountersService {
  constructor(
    @InjectRepository(Counter)
    private readonly repo: MongoRepository<Counter>,
  ) {}

  /**
   * Incrementa el contador y devuelve el código formateado.
   * @param name Nombre del contador (ej: "reagents")
   * @param prefix Prefijo del código (ej: "REAC")
   * @param padLength Longitud mínima del número (default 4 → 0001)
   */
  async nextCode(
    name: string,
    prefix: string,
    padLength = 4,
  ): Promise<string> {
    // @ts-ignore - MongoDB driver method
    const result = await this.repo.findOneAndUpdate(
      { name },
      { $inc: { value: 1 } },
      { upsert: true, returnDocument: "after" },
    );
    // Some driver versions return the doc directly, others wrap in { value }
    const doc = result?.value ?? result;
    const num = doc?.value ?? 1;
    return `${prefix}-${String(num).padStart(padLength, "0")}`;
  }
}
