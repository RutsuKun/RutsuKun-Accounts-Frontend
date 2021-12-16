import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "logs",
  engine: "InnoDB",
})
export class LogEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "uuid" })
  @Generated("uuid")
  uuid?: string;

  @Column({ type: "varchar" })
  service: string;

  @Column({ type: "varchar" })
  process: string;

  @Column({ type: "date" })
  timestamp: Date;

  @Column({ type: "varchar" })
  level: string;

  @Column({ type: "varchar" })
  message: string;

  @Column({ type: "text" })
  stacktrace: string;

  @Column({ type: "varchar",nullable: true })
  accountId: string;

  @Column({ type: "varchar", nullable: true })
  clientId: string;
}
