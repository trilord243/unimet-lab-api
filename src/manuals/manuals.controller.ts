import {
  Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ManualsService } from "./manuals.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("manuals")
@Controller("manuals")
export class ManualsController {
  constructor(private readonly service: ManualsService) {}

  /** Endpoint público: muestra solo manuales con visibility=public */
  @Get("public")
  publicList() { return this.service.findPublic(); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) { return this.service.findOne(id); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post() @Roles("professor", "superadmin")
  create(@Body() body: any, @Req() req: any) {
    return this.service.create({ ...body, uploadedBy: req.user.userId });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(":id") @Roles("professor", "superadmin")
  update(@Param("id") id: string, @Body() body: any) { return this.service.update(id, body); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id") @Roles("professor", "superadmin")
  remove(@Param("id") id: string) { return this.service.remove(id); }
}
