import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { Equipment } from "./equipment.entity";
import { CountersService } from "../common/counters/counters.service";
import { InventoryHistoryService } from "../inventory-history/inventory-history.service";

interface ActorContext {
  userId?: string;
  userName?: string;
}

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectRepository(Equipment)
    private readonly repo: MongoRepository<Equipment>,
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
          { brand: { $regex: q, $options: "i" } },
          { model: { $regex: q, $options: "i" } },
          { assetCode: { $regex: q, $options: "i" } },
        ],
      } as any,
    });
  }

  async findOne(id: string) {
    const found = await this.repo.findOneBy({ _id: new ObjectId(id) });
    if (!found) throw new NotFoundException("Equipo no encontrado");
    return found;
  }

  async findByAssetCode(code: string) {
    return this.repo.findOneBy({ assetCode: code } as any);
  }

  async create(data: Partial<Equipment>, actor: ActorContext = {}) {
    const assetCode = await this.counters.nextCode("equipments", "EQUIP");
    const e = this.repo.create({
      ...data,
      assetCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await this.repo.save(e);
    await this.history.log({
      itemType: "equipment",
      itemId: saved._id.toString(),
      assetCode: saved.assetCode,
      itemName: saved.name,
      action: "created",
      performedBy: actor.userId,
      performedByName: actor.userName,
    });
    return saved;
  }

  async update(
    id: string,
    data: Partial<Equipment>,
    actor: ActorContext = {},
  ) {
    const found = await this.findOne(id);
    const before = JSON.parse(JSON.stringify(found));
    Object.assign(found, data, { updatedAt: new Date() });
    const saved = await this.repo.save(found);
    const changes = InventoryHistoryService.diff(before, saved);
    if (Object.keys(changes).length > 0) {
      const isStatusChange =
        !!changes.status && changes.status.from !== changes.status.to;
      await this.history.log({
        itemType: "equipment",
        itemId: saved._id.toString(),
        assetCode: saved.assetCode,
        itemName: saved.name,
        action: isStatusChange ? "status_change" : "updated",
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
      itemType: "equipment",
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
