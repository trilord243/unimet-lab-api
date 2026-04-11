import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/** Reserva de un EQUIPO del laboratorio (slot horario). */
@Entity("equipment_reservations")
export class EquipmentReservation {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: string;

  @Column()
  equipmentId: string;

  @Column()
  date: Date;

  @Column("array")
  timeBlocks: string[];

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
