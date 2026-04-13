import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

export type InventoryItemType = "reagent" | "material" | "equipment";
export type InventoryAction =
  | "created"
  | "updated"
  | "deleted"
  | "quantity_in"
  | "quantity_out"
  | "status_change";

/**
 * Audit log de cambios en inventario.
 * Cada operación CRUD o cambio de stock queda registrado aquí con
 * quién, cuándo, qué cambió y opcionalmente por qué.
 */
@Entity("inventory_history")
export class InventoryHistoryEntry {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  itemType: InventoryItemType;

  @Column()
  itemId: string;

  @Column({ nullable: true })
  assetCode?: string;

  @Column({ nullable: true })
  itemName?: string;

  @Column()
  action: InventoryAction;

  @Column({ nullable: true })
  performedBy?: string;

  @Column({ nullable: true })
  performedByName?: string;

  /** Snapshot del diff: { field: { from, to } } */
  @Column("simple-json", { nullable: true })
  changes?: Record<string, { from: any; to: any }>;

  /** Para stock: cantidad que entró/salió y unidad */
  @Column({ nullable: true })
  delta?: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ nullable: true })
  reason?: string;

  @Column({ default: () => "new Date()" })
  createdAt: Date;
}
