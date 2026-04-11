import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { EquipmentsService } from "./equipments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("equipments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("equipments")
export class EquipmentsController {
  constructor(private readonly service: EquipmentsService) {}

  @Get() findAll(@Query("q") q?: string) {
    return q ? this.service.search(q) : this.service.findAll();
  }
  @Get(":id") findOne(@Param("id") id: string) { return this.service.findOne(id); }

  @Post() @Roles("professor", "superadmin")
  create(@Body() body: any) { return this.service.create(body); }

  @Patch(":id") @Roles("professor", "superadmin")
  update(@Param("id") id: string, @Body() body: any) { return this.service.update(id, body); }

  @Delete(":id") @Roles("professor", "superadmin")
  remove(@Param("id") id: string) { return this.service.remove(id); }
}
