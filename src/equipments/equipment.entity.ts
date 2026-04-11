import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/** Equipo del laboratorio: bombas, columnas, balanzas, etc. Reservable por slot horario. */
@Entity("equipments")
export class Equipment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  serialNumber?: string;

  @Column({ default: "available" })
  status: "available" | "in_use" | "maintenance" | "retired";

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  imageURL?: string;

  @Column({ nullable: true })
  manualLink?: string;

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
