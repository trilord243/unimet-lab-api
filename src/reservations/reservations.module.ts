import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SpaceReservation } from "./space-reservation.entity";
import { EquipmentReservation } from "./equipment-reservation.entity";
import { ReagentRequest } from "./reagent-request.entity";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpaceReservation,
      EquipmentReservation,
      ReagentRequest,
    ]),
    NotificationsModule,
  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
