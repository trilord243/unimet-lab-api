import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { ClassSchedule } from "./class-schedule.entity";

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private readonly repo: MongoRepository<ClassSchedule>,
  ) {}

  findAll() { return this.repo.find(); }

  findByDate(date: string) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    return this.repo.find({
      where: { date: { $gte: start, $lt: end } } as any,
    });
  }

  async findOne(id: string) {
    const found = await this.repo.findOneBy({ _id: new ObjectId(id) });
    if (!found) throw new NotFoundException("Clase no encontrada");
    return found;
  }

  create(data: Partial<ClassSchedule>) {
    const e = this.repo.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.repo.save(e);
  }

  async update(id: string, data: Partial<ClassSchedule>) {
    const found = await this.findOne(id);
    Object.assign(found, data, { updatedAt: new Date() });
    return this.repo.save(found);
  }

  async remove(id: string) {
    await this.repo.deleteOne({ _id: new ObjectId(id) });
    return { deleted: true };
  }
}
