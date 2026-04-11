import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/** Trabajos de investigación realizados en el laboratorio. */
@Entity("research_projects")
export class ResearchProject {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  leadProfessor: string; // userId

  @Column("array")
  students: string[]; // userIds

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Column({ default: "active" })
  status: "active" | "completed" | "paused" | "cancelled";

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
