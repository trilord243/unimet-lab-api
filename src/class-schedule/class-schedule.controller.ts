import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ClassScheduleService } from "./class-schedule.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("class-schedule")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("class-schedule")
export class ClassScheduleController {
  constructor(private readonly service: ClassScheduleService) {}

  @Get()
  findAll(@Query("date") date?: string) {
    return date ? this.service.findByDate(date) : this.service.findAll();
  }

  @Get(":id") findOne(@Param("id") id: string) { return this.service.findOne(id); }

  @Post() @Roles("professor", "superadmin")
  create(@Body() body: any, @Req() req: any) {
    return this.service.create({ ...body, professorId: req.user.userId });
  }

  @Patch(":id") @Roles("professor", "superadmin")
  update(@Param("id") id: string, @Body() body: any) { return this.service.update(id, body); }

  @Delete(":id") @Roles("professor", "superadmin")
  remove(@Param("id") id: string) { return this.service.remove(id); }
}
