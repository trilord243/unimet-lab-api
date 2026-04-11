import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { Space } from "./space.entity";

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private readonly repo: MongoRepository<Space>,
  ) {}

  findAll() { return this.repo.find(); }

  async findOne(id: string) {
    const found = await this.repo.findOneBy({ _id: new ObjectId(id) });
    if (!found) throw new NotFoundException("Espacio no encontrado");
    return found;
  }

  create(data: Partial<Space>) {
    const e = this.repo.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.repo.save(e);
  }

  async update(id: string, data: Partial<Space>) {
    const found = await this.findOne(id);
    Object.assign(found, data, { updatedAt: new Date() });
    return this.repo.save(found);
  }

  async remove(id: string) {
    await this.repo.deleteOne({ _id: new ObjectId(id) });
    return { deleted: true };
  }
}
