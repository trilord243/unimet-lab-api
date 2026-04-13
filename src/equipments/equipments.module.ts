import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Equipment } from "./equipment.entity";
import { EquipmentsService } from "./equipments.service";
import { EquipmentsController } from "./equipments.controller";
import { CountersModule } from "../common/counters/counters.module";
import { InventoryHistoryModule } from "../inventory-history/inventory-history.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipment]),
    CountersModule,
    InventoryHistoryModule,
  ],
  providers: [EquipmentsService],
  controllers: [EquipmentsController],
  exports: [EquipmentsService],
})
export class EquipmentsModule {}
