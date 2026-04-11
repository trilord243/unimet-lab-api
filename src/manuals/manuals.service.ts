import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { Manual } from "./manual.entity";

@Injectable()
export class ManualsService {
  constructor(
    @InjectRepository(Manual)
    private readonly repo: MongoRepository<Manual>,
  ) {}

  findAll(visibility?: string) {
    if (visibility) {
      return this.repo.find({ where: { visibility } as any });
    }
    return this.repo.find();
  }

  findPublic() {
    return this.repo.find({ where: { visibility: "public" } as any });
  }

  async findOne(id: string) {
    const found = await this.repo.findOneBy({ _id: new ObjectId(id) });
    if (!found) throw new NotFoundException("Manual no encontrado");
    return found;
  }

  create(data: Partial<Manual>) {
    const e = this.repo.create({
      ...data,
      tags: data.tags ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.repo.save(e);
  }

  async update(id: string, data: Partial<Manual>) {
    const found = await this.findOne(id);
    Object.assign(found, data, { updatedAt: new Date() });
    return this.repo.save(found);
  }

  async remove(id: string) {
    await this.repo.deleteOne({ _id: new ObjectId(id) });
    return { deleted: true };
  }
}
