import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/** Material de laboratorio: vasos, pipetas, embudos, columnas, etc. */
@Entity("materials")
export class Material {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ nullable: true })
  category?: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
