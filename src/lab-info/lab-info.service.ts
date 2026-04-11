import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { PublicProfessor } from "./professor.entity";
import { SafetyRule } from "./safety-rule.entity";

@Injectable()
export class LabInfoService {
  constructor(
    @InjectRepository(PublicProfessor)
    private readonly professorsRepo: MongoRepository<PublicProfessor>,
    @InjectRepository(SafetyRule)
    private readonly safetyRepo: MongoRepository<SafetyRule>,
  ) {}

  // -------- PROFESORES --------
  listProfessors() {
    return this.professorsRepo.find({ order: { order: "ASC" } });
  }
  createProfessor(data: Partial<PublicProfessor>) {
    const e = this.professorsRepo.create({
      ...data,
      asignatures: data.asignatures ?? [],
      interestAreas: data.interestAreas ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.professorsRepo.save(e);
  }
  async updateProfessor(id: string, data: Partial<PublicProfessor>) {
    const e = await this.professorsRepo.findOneBy({ _id: new ObjectId(id) });
    if (!e) return null;
    Object.assign(e, data, { updatedAt: new Date() });
    return this.professorsRepo.save(e);
  }
  async removeProfessor(id: string) {
    await this.professorsRepo.deleteOne({ _id: new ObjectId(id) });
    return { deleted: true };
  }

  // -------- NORMATIVAS --------
  listSafetyRules() {
    return this.safetyRepo.find({ order: { order: "ASC" } });
  }
  createSafetyRule(data: Partial<SafetyRule>) {
    const e = this.safetyRepo.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.safetyRepo.save(e);
  }
  async updateSafetyRule(id: string, data: Partial<SafetyRule>) {
    const e = await this.safetyRepo.findOneBy({ _id: new ObjectId(id) });
    if (!e) return null;
    Object.assign(e, data, { updatedAt: new Date() });
    return this.safetyRepo.save(e);
  }
  async removeSafetyRule(id: string) {
    await this.safetyRepo.deleteOne({ _id: new ObjectId(id) });
    return { deleted: true };
  }
}
