import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { Reagent } from "./reagent.entity";
import { CreateReagentDto } from "./dto/create-reagent.dto";
import { UpdateReagentDto } from "./dto/update-reagent.dto";
import { CountersService } from "../common/counters/counters.service";
import { InventoryHistoryService } from "../inventory-history/inventory-history.service";

interface ActorContext {
  userId?: string;
  userName?: string;
}

@Injectable()
export class ReagentsService {
  constructor(
    @InjectRepository(Reagent)
    private readonly repo: MongoRepository<Reagent>,
    private readonly counters: CountersService,
    private readonly history: InventoryHistoryService,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const found = await this.repo.findOneBy({ _id: new ObjectId(id) });
    if (!found) throw new NotFoundException("Reactivo no encontrado");
    return found;
  }

  async findByAssetCode(code: string) {
    return this.repo.findOneBy({ assetCode: code } as any);
  }

  search(query: string) {
    return this.repo.find({
      where: {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { formula: { $regex: query, $options: "i" } },
          { casNumber: { $regex: query, $options: "i" } },
          { assetCode: { $regex: query, $options: "i" } },
        ],
      } as any,
    });
  }

  async create(dto: CreateReagentDto, actor: ActorContext = {}) {
    const assetCode = await this.counters.nextCode("reagents", "REAC");
    const entity = this.repo.create({
      ...dto,
      assetCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await this.repo.save(entity);
    await this.history.log({
      itemType: "reagent",
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

  async update(id: string, dto: UpdateReagentDto, actor: ActorContext = {}) {
    const found = await this.findOne(id);
    const beforeSnapshot = JSON.parse(JSON.stringify(found));
    Object.assign(found, dto, { updatedAt: new Date() });
    const saved = await this.repo.save(found);
    const changes = InventoryHistoryService.diff(beforeSnapshot, saved);
    if (Object.keys(changes).length > 0) {
      await this.history.log({
        itemType: "reagent",
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
      itemType: "reagent",
      itemId: id,
      assetCode: before.assetCode,
      itemName: before.name,
      action: "deleted",
      performedBy: actor.userId,
      performedByName: actor.userName,
    });
    return { deleted: true };
  }

  /**
   * Descuenta cantidad del stock (usado al aprobar ReagentRequest).
   * Registra una entrada quantity_out en el historial.
   */
  async consumeStock(
    id: string,
    amount: number,
    reason: string,
    actor: ActorContext = {},
  ) {
    const reagent = await this.findOne(id);
    reagent.quantity = Math.max(0, reagent.quantity - amount);
    reagent.updatedAt = new Date();
    const saved = await this.repo.save(reagent);
    await this.history.log({
      itemType: "reagent",
      itemId: saved._id.toString(),
      assetCode: saved.assetCode,
      itemName: saved.name,
      action: "quantity_out",
      delta: amount,
      unit: saved.unit,
      reason,
      performedBy: actor.userId,
      performedByName: actor.userName,
    });
    return saved;
  }

  findLowStock() {
    return this.repo.find({
      where: { $expr: { $lt: ["$quantity", "$lowStockThreshold"] } } as any,
    });
  }
}
