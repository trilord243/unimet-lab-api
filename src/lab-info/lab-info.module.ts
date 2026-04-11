import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicProfessor } from "./professor.entity";
import { SafetyRule } from "./safety-rule.entity";
import { LabInfoService } from "./lab-info.service";
import { LabInfoController } from "./lab-info.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PublicProfessor, SafetyRule])],
  providers: [LabInfoService],
  controllers: [LabInfoController],
  exports: [LabInfoService],
})
export class LabInfoModule {}
