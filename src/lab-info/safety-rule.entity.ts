import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/** Normativas de seguridad mostradas en la página pública. */
@Entity("safety_rules")
export class SafetyRule {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  iconName?: string;

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
