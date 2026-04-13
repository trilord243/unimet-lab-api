import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reagent } from "./reagent.entity";
import { ReagentsService } from "./reagents.service";
import { ReagentsController } from "./reagents.controller";
import { CountersModule } from "../common/counters/counters.module";
import { InventoryHistoryModule } from "../inventory-history/inventory-history.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Reagent]),
    CountersModule,
    InventoryHistoryModule,
  ],
  providers: [ReagentsService],
  controllers: [ReagentsController],
  exports: [ReagentsService],
})
export class ReagentsModule {}
