import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import {
  InventoryHistoryEntry,
  InventoryItemType,
  InventoryAction,
} from "./inventory-history.entity";

interface LogEntryInput {
  itemType: InventoryItemType;
  itemId: string;
  assetCode?: string;
  itemName?: string;
  action: InventoryAction;
  performedBy?: string;
  performedByName?: string;
  changes?: Record<string, { from: any; to: any }>;
  delta?: number;
  unit?: string;
  reason?: string;
}

@Injectable()
export class InventoryHistoryService {
  private readonly logger = new Logger(InventoryHistoryService.name);

  constructor(
    @InjectRepository(InventoryHistoryEntry)
    private readonly repo: MongoRepository<InventoryHistoryEntry>,
  ) {}

  async log(input: LogEntryInput): Promise<void> {
    try {
      const entry = this.repo.create({
        ...input,
        createdAt: new Date(),
      });
      await this.repo.save(entry);
    } catch (e) {
      // Nunca fallar por un log de audit
      this.logger.error(`Error logging inventory history: ${e}`);
    }
  }

  /** Calcula el diff entre dos objetos, ignorando timestamps. */
  static diff(
    before: Record<string, any>,
    after: Record<string, any>,
    ignore: string[] = ["updatedAt", "createdAt", "_id"],
  ): Record<string, { from: any; to: any }> {
    const result: Record<string, { from: any; to: any }> = {};
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of allKeys) {
      if (ignore.includes(key)) continue;
      const a = before[key];
      const b = after[key];
      const sameValue =
        JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
      if (!sameValue) {
        result[key] = { from: a ?? null, to: b ?? null };
      }
    }
    return result;
  }

  // -------- Consultas --------

  /** Historial de un ítem específico, más reciente primero. */
  findByItem(itemType: InventoryItemType, itemId: string) {
    return this.repo.find({
      where: { itemType, itemId },
      order: { createdAt: "DESC" },
    } as any);
  }

  /** Historial global con filtros opcionales. */
  async findAll(filters: {
    itemType?: InventoryItemType;
    action?: InventoryAction;
    performedBy?: string;
    limit?: number;
  } = {}) {
    const where: any = {};
    if (filters.itemType) where.itemType = filters.itemType;
    if (filters.action) where.action = filters.action;
    if (filters.performedBy) where.performedBy = filters.performedBy;

    return this.repo.find({
      where,
      order: { createdAt: "DESC" },
      take: filters.limit ?? 100,
    } as any);
  }
}
