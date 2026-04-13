import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { Counter } from "./counter.entity";

/**
 * Genera códigos secuenciales atómicamente.
 * Format: PREFIX-0001, PREFIX-0002, etc.
 *
 * Implementación: usa updateOne (atómico) y luego findOneBy para leer
 * el valor. No dependemos del wrapper de findOneAndUpdate cuyo formato
 * varía entre versiones del driver y causa ambigüedad con nuestro
 * campo llamado "value".
 */
@Injectable()
export class CountersService {
  constructor(
    @InjectRepository(Counter)
    private readonly repo: MongoRepository<Counter>,
  ) {}

  async nextCode(
    name: string,
    prefix: string,
    padLength = 4,
  ): Promise<string> {
    await this.repo.updateOne(
      { name },
      { $inc: { value: 1 } },
      { upsert: true },
    );
    const current = await this.repo.findOneBy({ name } as any);
    const num = current?.value ?? 1;
    return `${prefix}-${String(num).padStart(padLength, "0")}`;
  }
}
