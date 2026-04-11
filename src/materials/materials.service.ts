import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { Material } from "./material.entity";

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly repo: MongoRepository<Material>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  search(q: string) {
    return this.repo.find({
      where: { name: { $regex: q, $options: "i" } } as any,
    });
  }

  async findOne(id: string) {
    const found = await this.repo.findOneBy({ _id: new ObjectId(id) });
    if (!found) throw new NotFoundException("Material no encontrado");
    return found;
  }

  create(data: Partial<Material>) {
    const e = this.repo.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.repo.save(e);
  }

  async update(id: string, data: Partial<Material>) {
    const found = await this.findOne(id);
    Object.assign(found, data, { updatedAt: new Date() });
    return this.repo.save(found);
  }

  async remove(id: string) {
    await this.repo.deleteOne({ _id: new ObjectId(id) });
    return { deleted: true };
  }
}
