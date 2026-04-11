import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/** Espacios reservables del laboratorio (mesones, áreas, salas). */
@Entity("spaces")
export class Space {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  capacity?: number;

  @Column({ nullable: true })
  location?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
