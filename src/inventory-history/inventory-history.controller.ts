import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { InventoryHistoryService } from "./inventory-history.service";
import type {
  InventoryItemType,
  InventoryAction,
} from "./inventory-history.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("inventory-history")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("professor", "superadmin")
@Controller("inventory-history")
export class InventoryHistoryController {
  constructor(private readonly service: InventoryHistoryService) {}

  @Get()
  findAll(
    @Query("itemType") itemType?: InventoryItemType,
    @Query("action") action?: InventoryAction,
    @Query("performedBy") performedBy?: string,
    @Query("limit") limit?: string,
  ) {
    return this.service.findAll({
      itemType,
      action,
      performedBy,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(":itemType/:itemId")
  findByItem(
    @Param("itemType") itemType: InventoryItemType,
    @Param("itemId") itemId: string,
  ) {
    return this.service.findByItem(itemType, itemId);
  }
}
