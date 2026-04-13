import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { Material } from "./material.entity";
import { CountersService } from "../common/counters/counters.service";
import { InventoryHistoryService } from "../inventory-history/inventory-history.service";

interface ActorContext {
  userId?: string;
  userName?: string;
}

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly repo: MongoRepository<Material>,
    private readonly counters: CountersService,
    private readonly history: InventoryHistoryService,
  ) {}

  findAll() {
    return this.repo.find();
  }

  search(q: string) {
    return this.repo.find({
      where: {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
          { assetCode: { $regex: q, $options: "i" } },
        ],
      } as any,
    });
  }

  async findOne(id: string) {
    const found = await this.repo.findOneBy({ _id: new ObjectId(id) });
    if (!found) throw new NotFoundException("Material no encontrado");
    return found;
  }

  async findByAssetCode(code: string) {
    return this.repo.findOneBy({ assetCode: code } as any);
  }

  async create(data: Partial<Material>, actor: ActorContext = {}) {
    const assetCode = await this.counters.nextCode("materials", "MAT");
    const e = this.repo.create({
      ...data,
      assetCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await this.repo.save(e);
    await this.history.log({
      itemType: "material",
      itemId: saved._id.toString(),
      assetCode: saved.assetCode,
      itemName: saved.name,
      action: "created",
      performedBy: actor.userId,
      performedByName: actor.userName,
      delta: saved.quantity,
      unit: saved.unit,
    });
    return saved;
  }

  async update(
    id: string,
    data: Partial<Material>,
    actor: ActorContext = {},
  ) {
    const found = await this.findOne(id);
    const before = JSON.parse(JSON.stringify(found));
    Object.assign(found, data, { updatedAt: new Date() });
    const saved = await this.repo.save(found);
    const changes = InventoryHistoryService.diff(before, saved);
    if (Object.keys(changes).length > 0) {
      await this.history.log({
        itemType: "material",
        itemId: saved._id.toString(),
        assetCode: saved.assetCode,
        itemName: saved.name,
        action: "updated",
        performedBy: actor.userId,
        performedByName: actor.userName,
        changes,
      });
    }
    return saved;
  }

  async remove(id: string, actor: ActorContext = {}) {
    const before = await this.findOne(id);
    await this.repo.deleteOne({ _id: new ObjectId(id) });
    await this.history.log({
      itemType: "material",
      itemId: id,
      assetCode: before.assetCode,
      itemName: before.name,
      action: "deleted",
      performedBy: actor.userId,
      performedByName: actor.userName,
    });
    return { deleted: true };
  }
}
