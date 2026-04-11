import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ResearchProject } from "./research-project.entity";
import { ResearchProjectsService } from "./research-projects.service";
import { ResearchProjectsController } from "./research-projects.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ResearchProject])],
  providers: [ResearchProjectsService],
  controllers: [ResearchProjectsController],
  exports: [ResearchProjectsService],
})
export class ResearchProjectsModule {}
