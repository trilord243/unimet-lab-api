import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Manual } from "./manual.entity";
import { ManualsService } from "./manuals.service";
import { ManualsController } from "./manuals.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Manual])],
  providers: [ManualsService],
  controllers: [ManualsController],
  exports: [ManualsService],
})
export class ManualsModule {}
