import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

/**
 * Reactivo químico del inventario del Laboratorio de Procesos de Separación.
 * Estos se SOLICITAN (consumibles) — ver ReagentRequest en módulo reservations.
 */
@Entity("reagents")
export class Reagent {
  @ObjectIdColumn()
  _id: ObjectId;

  /** Código único de activo (REAC-0001) asignado al crear. */
  @Column({ nullable: true })
  assetCode?: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  formula?: string;

  @Column({ nullable: true })
  casNumber?: string;

  @Column()
  quantity: number;

  @Column()
  unit: string; // g, mL, L, kg, mol, etc.

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  hazardClass?: string;

  @Column({ nullable: true })
  msdsLink?: string;

  @Column({ default: 0 })
  lowStockThreshold: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
