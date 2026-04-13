import { Entity, Column, ObjectIdColumn } from "typeorm";
import { ObjectId } from "mongodb";

/**
 * Counter atómico por tipo de recurso. Usado para generar assetCodes
 * secuenciales (REAC-0001, MAT-0001, EQUIP-0001, etc).
 */
@Entity("counters")
export class Counter {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string; // ej: "reagents", "materials", "equipments"

  @Column()
  value: number;
}
