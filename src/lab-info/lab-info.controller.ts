import {
  Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LabInfoService } from "./lab-info.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("lab-info")
@Controller("lab-info")
export class LabInfoController {
  constructor(private readonly service: LabInfoService) {}

  // ----- PÚBLICO -----
  @Get("public/professors") publicProfessors() { return this.service.listProfessors(); }
  @Get("public/safety-rules") publicSafetyRules() { return this.service.listSafetyRules(); }

  // ----- ADMIN: PROFESORES -----
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("superadmin")
  @Post("professors")
  createProfessor(@Body() body: any) { return this.service.createProfessor(body); }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles("superadmin")
  @Patch("professors/:id")
  updateProfessor(@Param("id") id: string, @Body() body: any) {
    return this.service.updateProfessor(id, body);
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles("superadmin")
  @Delete("professors/:id")
  removeProfessor(@Param("id") id: string) { return this.service.removeProfessor(id); }

  // ----- ADMIN: NORMATIVAS -----
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles("superadmin")
  @Post("safety-rules")
  createSafetyRule(@Body() body: any) { return this.service.createSafetyRule(body); }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles("superadmin")
  @Patch("safety-rules/:id")
  updateSafetyRule(@Param("id") id: string, @Body() body: any) {
    return this.service.updateSafetyRule(id, body);
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles("superadmin")
  @Delete("safety-rules/:id")
  removeSafetyRule(@Param("id") id: string) { return this.service.removeSafetyRule(id); }
}
