import { Module } from "@nestjs/common";
import { AssetsController } from "./assets.controller";
import { ReagentsModule } from "../reagents/reagents.module";
import { MaterialsModule } from "../materials/materials.module";
import { EquipmentsModule } from "../equipments/equipments.module";

@Module({
  imports: [ReagentsModule, MaterialsModule, EquipmentsModule],
  controllers: [AssetsController],
})
export class AssetsModule {}
