import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryHistoryEntry } from "./inventory-history.entity";
import { InventoryHistoryService } from "./inventory-history.service";
import { InventoryHistoryController } from "./inventory-history.controller";

@Module({
  imports: [TypeOrmModule.forFeature([InventoryHistoryEntry])],
  providers: [InventoryHistoryService],
  controllers: [InventoryHistoryController],
  exports: [InventoryHistoryService],
})
export class InventoryHistoryModule {}
