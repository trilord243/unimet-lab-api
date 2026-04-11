import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/**
 * Reserva de un ESPACIO del laboratorio (slot horario).
 * Estados: pending → approved/rejected → completed/cancelled
 */
@Entity("space_reservations")
export class SpaceReservation {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: string;

  @Column()
  spaceId: string;

  @Column()
  date: Date;

  @Column("array")
  timeBlocks: string[]; // ej: ["07:00-08:45","08:45-10:30"]

  @Column({ default: "pending" })
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  resolvedBy?: string;

  @Column({ nullable: true })
  rejectionReason?: string;

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
