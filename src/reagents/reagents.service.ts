import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { Reagent } from "./reagent.entity";
import { CreateReagentDto } from "./dto/create-reagent.dto";
import { UpdateReagentDto } from "./dto/update-reagent.dto";

@Injectable()
export class ReagentsService {
  constructor(
    @InjectRepository(Reagent)
    private readonly repo: MongoRepository<Reagent>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const found = await this.repo.findOneBy({ _id: new ObjectId(id) });
    if (!found) throw new NotFoundException("Reactivo no encontrado");
    return found;
  }

  search(query: string) {
    return this.repo.find({
      where: {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { formula: { $regex: query, $options: "i" } },
          { casNumber: { $regex: query, $options: "i" } },
        ],
      } as any,
    });
  }

  create(dto: CreateReagentDto) {
    const entity = this.repo.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateReagentDto) {
    const found = await this.findOne(id);
    Object.assign(found, dto, { updatedAt: new Date() });
    return this.repo.save(found);
  }

  async remove(id: string) {
    await this.repo.deleteOne({ _id: new ObjectId(id) });
    return { deleted: true };
  }

  /** Lista reactivos con stock por debajo del umbral (para alertas al profesor). */
  findLowStock() {
    return this.repo.find({
      where: { $expr: { $lt: ["$quantity", "$lowStockThreshold"] } } as any,
    });
  }
}
