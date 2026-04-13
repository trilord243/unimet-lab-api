import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReagentsService } from "./reagents.service";
import { CreateReagentDto } from "./dto/create-reagent.dto";
import { UpdateReagentDto } from "./dto/update-reagent.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

function actorFrom(req: any) {
  return {
    userId: req?.user?.userId,
    userName: req?.user?.email,
  };
}

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

  @Get("by-code/:code")
  findByCode(@Param("code") code: string) {
    return this.service.findByAssetCode(code);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles("professor", "superadmin")
  create(@Body() dto: CreateReagentDto, @Req() req: any) {
    return this.service.create(dto, actorFrom(req));
  }

  @Patch(":id")
  @Roles("professor", "superadmin")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateReagentDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, actorFrom(req));
  }

  @Delete(":id")
  @Roles("professor", "superadmin")
  remove(@Param("id") id: string, @Req() req: any) {
    return this.service.remove(id, actorFrom(req));
  }
}
