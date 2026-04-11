import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { ResearchProject } from "./research-project.entity";

@Injectable()
export class ResearchProjectsService {
  constructor(
    @InjectRepository(ResearchProject)
    private readonly repo: MongoRepository<ResearchProject>,
  ) {}

  findAll() { return this.repo.find(); }

  async findOne(id: string) {
    const found = await this.repo.findOneBy({ _id: new ObjectId(id) });
    if (!found) throw new NotFoundException("Trabajo de investigación no encontrado");
    return found;
  }

  create(data: Partial<ResearchProject>) {
    const e = this.repo.create({
      ...data,
      students: data.students ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.repo.save(e);
  }

  async update(id: string, data: Partial<ResearchProject>) {
    const found = await this.findOne(id);
    Object.assign(found, data, { updatedAt: new Date() });
    return this.repo.save(found);
  }

  async remove(id: string) {
    await this.repo.deleteOne({ _id: new ObjectId(id) });
    return { deleted: true };
  }
}
