import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/**
 * Manual de laboratorio.
 *
 * Estilo centromundox: NO se almacena el binario completo en la BD;
 * el manual es un registro con metadata + URL externa (Drive, Dropbox,
 * o un enlace público que el profesor pegue). En el panel del profesor
 * se ven como CARDS y el alumno puede visualizar/descargar.
 */
@Entity("manuals")
export class Manual {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  /** Asignatura / curso al que pertenece (Operaciones I, etc.) */
  @Column({ nullable: true })
  subject?: string;

  /** URL pública al PDF (Drive, Dropbox, etc.) */
  @Column()
  fileUrl: string;

  /** URL miniatura para la card */
  @Column({ nullable: true })
  coverUrl?: string;

  @Column("array")
  tags: string[];

  @Column()
  uploadedBy: string; // userId del profesor

  /** Visibilidad: público, sólo estudiantes registrados, sólo profesores */
  @Column({ default: "students" })
  visibility: "public" | "students" | "professors";

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
