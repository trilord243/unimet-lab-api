import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Material } from "./material.entity";
import { MaterialsService } from "./materials.service";
import { MaterialsController } from "./materials.controller";
import { CountersModule } from "../common/counters/counters.module";
import { InventoryHistoryModule } from "../inventory-history/inventory-history.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Material]),
    CountersModule,
    InventoryHistoryModule,
  ],
  providers: [MaterialsService],
  controllers: [MaterialsController],
  exports: [MaterialsService],
})
export class MaterialsModule {}
