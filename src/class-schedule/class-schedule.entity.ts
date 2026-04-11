import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/**
 * Clase / actividad académica programada en el laboratorio.
 * Gestionada por el profesor desde su panel.
 */
@Entity("class_schedules")
export class ClassSchedule {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  professorId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  spaceId?: string;

  @Column()
  date: Date;

  @Column()
  startTime: string; // "07:00"

  @Column()
  endTime: string; // "10:30"

  @Column({ default: "none" })
  recurrence: "none" | "weekly" | "biweekly";

  @Column({ nullable: true })
  recurrenceUntil?: Date;

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
