import {
  Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SpacesService } from "./spaces.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("spaces")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("spaces")
export class SpacesController {
  constructor(private readonly service: SpacesService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(":id") findOne(@Param("id") id: string) { return this.service.findOne(id); }

  @Post() @Roles("professor", "superadmin")
  create(@Body() body: any) { return this.service.create(body); }

  @Patch(":id") @Roles("professor", "superadmin")
  update(@Param("id") id: string, @Body() body: any) { return this.service.update(id, body); }

  @Delete(":id") @Roles("superadmin")
  remove(@Param("id") id: string) { return this.service.remove(id); }
}
