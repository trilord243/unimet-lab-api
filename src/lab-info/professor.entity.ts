import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/**
 * Profesor mostrado en el carrusel público de "Nuestros Profesores".
 * Distinto del User: aquí solo metadata pública para landing.
 */
@Entity("public_professors")
export class PublicProfessor {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  education?: string;

  @Column("array")
  asignatures: string[];

  @Column("array")
  interestAreas: string[];

  @Column({ nullable: true })
  imgURL?: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
