import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity("users")
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  cedula?: string;

  @Column()
  password: string;

  /** Roles del Lab UNIMET */
  @Column()
  role: "superadmin" | "professor" | "student";

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  verificationCode?: string;

  @Column({ nullable: true })
  verificationCodeExpiresAt?: Date;

  @Column({ nullable: true })
  passwordResetCode?: string;

  @Column({ nullable: true })
  passwordResetCodeExpiresAt?: Date;

  @Column({ nullable: true })
  photoURL?: string;

  @Column({ default: () => "new Date()" })
  createdAt: Date;

  @Column({ default: () => "new Date()" })
  updatedAt: Date;
}
