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
import { ReagentsService } from "./reagents.service";
import { CreateReagentDto } from "./dto/create-reagent.dto";
import { UpdateReagentDto } from "./dto/update-reagent.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("reagents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("reagents")
export class ReagentsController {
  constructor(private readonly service: ReagentsService) {}

  @Get()
  findAll(@Query("q") q?: string) {
    return q ? this.service.search(q) : this.service.findAll();
  }

  @Get("low-stock")
  @Roles("professor", "superadmin")
  lowStock() {
    return this.service.findLowStock();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles("professor", "superadmin")
  create(@Body() dto: CreateReagentDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @Roles("professor", "superadmin")
  update(@Param("id") id: string, @Body() dto: UpdateReagentDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @Roles("professor", "superadmin")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
