import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reagent } from "./reagent.entity";
import { ReagentsService } from "./reagents.service";
import { ReagentsController } from "./reagents.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Reagent])],
  providers: [ReagentsService],
  controllers: [ReagentsController],
  exports: [ReagentsService],
})
export class ReagentsModule {}
