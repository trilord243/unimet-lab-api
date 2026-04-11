import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/** Compras requeridas: lista de cosas que el lab necesita comprar. */
@Entity("purchases")
export class Purchase {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  itemName: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  estimatedQuantity?: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ nullable: true })
  estimatedCost?: number;

  @Column()
  requestedBy: string; // userId

  @Column({ nullable: true })
  justification?: string;

  @Column({ default: "normal" })
  urgency: "low" | "normal" | "high" | "critical";

  @Column({ default: "pending" })
  status: "pending" | "approved" | "purchased" | "rejected";

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
