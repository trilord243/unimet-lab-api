import {
  Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PurchasesService } from "./purchases.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("purchases")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("purchases")
export class PurchasesController {
  constructor(private readonly service: PurchasesService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(":id") findOne(@Param("id") id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.service.create({ ...body, requestedBy: req.user.userId });
  }

  @Patch(":id") @Roles("professor", "superadmin")
  update(@Param("id") id: string, @Body() body: any) { return this.service.update(id, body); }

  @Delete(":id") @Roles("professor", "superadmin")
  remove(@Param("id") id: string) { return this.service.remove(id); }
}
