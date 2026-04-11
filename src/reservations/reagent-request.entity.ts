import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/**
 * Solicitud de un REACTIVO (consumible). No bloquea slot horario.
 * El profesor aprueba descontando del inventario.
 */
@Entity("reagent_requests")
export class ReagentRequest {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: string;

  @Column()
  reagentId: string;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column({ nullable: true })
  justification?: string;

  @Column({ default: "pending" })
  status: "pending" | "approved" | "rejected" | "delivered" | "cancelled";

  @Column({ nullable: true })
  resolvedBy?: string;

  @Column({ nullable: true })
  rejectionReason?: string;

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
