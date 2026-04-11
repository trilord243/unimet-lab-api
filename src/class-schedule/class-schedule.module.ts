import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassSchedule } from "./class-schedule.entity";
import { ClassScheduleService } from "./class-schedule.service";
import { ClassScheduleController } from "./class-schedule.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ClassSchedule])],
  providers: [ClassScheduleService],
  controllers: [ClassScheduleController],
  exports: [ClassScheduleService],
})
export class ClassScheduleModule {}
