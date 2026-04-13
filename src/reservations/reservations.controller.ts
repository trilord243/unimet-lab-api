import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReservationsService } from "./reservations.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CreateSpaceReservationDto } from "./dto/create-space-reservation.dto";
import { CreateEquipmentReservationDto } from "./dto/create-equipment-reservation.dto";
import { CreateReagentRequestDto } from "./dto/create-reagent-request.dto";
import { TIME_BLOCKS } from "./reservations.constants";

@ApiTags("reservations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("reservations")
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Get("time-blocks")
  timeBlocks() {
    return TIME_BLOCKS;
  }

  // ----- ESPACIOS -----
  @Post("spaces")
  createSpace(@Req() req: any, @Body() dto: CreateSpaceReservationDto) {
    return this.service.createSpaceReservation(req.user.userId, dto);
  }

  @Get("spaces")
  listSpaces(@Query("status") status?: string) {
    return this.service.listSpaceReservations(status ? { status } : {});
  }

  @Get("spaces/mine")
  mySpaces(@Req() req: any) {
    return this.service.listSpaceReservations({ userId: req.user.userId });
  }

  @Patch("spaces/:id/approve")
  @Roles("professor", "superadmin")
  approveSpace(@Param("id") id: string, @Req() req: any) {
    return this.service.approveSpaceReservation(id, req.user.userId);
  }

  @Patch("spaces/:id/reject")
  @Roles("professor", "superadmin")
  rejectSpace(
    @Param("id") id: string,
    @Req() req: any,
    @Body() body: { reason?: string },
  ) {
    return this.service.rejectSpaceReservation(id, req.user.userId, body?.reason);
  }

  // ----- EQUIPOS -----
  @Post("equipments")
  createEquipment(@Req() req: any, @Body() dto: CreateEquipmentReservationDto) {
    return this.service.createEquipmentReservation(req.user.userId, dto);
  }

  @Get("equipments")
  listEquipments(@Query("status") status?: string) {
    return this.service.listEquipmentReservations(status ? { status } : {});
  }

  @Get("equipments/mine")
  myEquipments(@Req() req: any) {
    return this.service.listEquipmentReservations({ userId: req.user.userId });
  }

  @Patch("equipments/:id/approve")
  @Roles("professor", "superadmin")
  approveEquipment(@Param("id") id: string, @Req() req: any) {
    return this.service.approveEquipmentReservation(id, req.user.userId);
  }

  @Patch("equipments/:id/reject")
  @Roles("professor", "superadmin")
  rejectEquipment(
    @Param("id") id: string,
    @Req() req: any,
    @Body() body: { reason?: string },
  ) {
    return this.service.rejectEquipmentReservation(
      id,
      req.user.userId,
      body?.reason,
    );
  }

  // ----- REACTIVOS -----
  @Post("reagents")
  createReagent(@Req() req: any, @Body() dto: CreateReagentRequestDto) {
    return this.service.createReagentRequest(req.user.userId, dto);
  }

  @Get("reagents")
  listReagents(@Query("status") status?: string) {
    return this.service.listReagentRequests(status ? { status } : {});
  }

  @Get("reagents/mine")
  myReagents(@Req() req: any) {
    return this.service.listReagentRequests({ userId: req.user.userId });
  }

  @Patch("reagents/:id/approve")
  @Roles("professor", "superadmin")
  approveReagent(@Param("id") id: string, @Req() req: any) {
    return this.service.approveReagentRequest(
      id,
      req.user.userId,
      req.user.email,
    );
  }

  @Patch("reagents/:id/reject")
  @Roles("professor", "superadmin")
  rejectReagent(
    @Param("id") id: string,
    @Req() req: any,
    @Body() body: { reason?: string },
  ) {
    return this.service.rejectReagentRequest(id, req.user.userId, body?.reason);
  }
}
