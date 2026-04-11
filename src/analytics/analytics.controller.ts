import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("analytics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("professor", "superadmin")
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get("overview")
  overview() {
    return this.service.overview();
  }
}
