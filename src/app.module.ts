import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { CommonModule } from "./common/common.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

// Inventarios
import { ReagentsModule } from "./reagents/reagents.module";
import { MaterialsModule } from "./materials/materials.module";
import { EquipmentsModule } from "./equipments/equipments.module";
import { PurchasesModule } from "./purchases/purchases.module";
import { ResearchProjectsModule } from "./research-projects/research-projects.module";

// Reservas
import { SpacesModule } from "./spaces/spaces.module";
import { ReservationsModule } from "./reservations/reservations.module";

// Otros
import { ClassScheduleModule } from "./class-schedule/class-schedule.module";
import { ManualsModule } from "./manuals/manuals.module";
import { LabInfoModule } from "./lab-info/lab-info.module";

// Notificaciones
import { EmailModule } from "./email/email.module";
import { WhatsAppModule } from "./whatsapp/whatsapp.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { WebSocketModule } from "./websocket/websocket.module";

// Analytics
import { AnalyticsModule } from "./analytics/analytics.module";

// Counters + audit + assets
import { CountersModule } from "./common/counters/counters.module";
import { InventoryHistoryModule } from "./inventory-history/inventory-history.module";
import { AssetsModule } from "./assets/assets.module";

@Module({
  imports: [
    ...(process.env.NODE_ENV === "test"
      ? []
      : [
          TypeOrmModule.forRoot({
            type: "mongodb",
            url:
              process.env.MONGODB_URI ||
              "mongodb://localhost:27017/unimet-lab",
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: false,
          }),
          CommonModule,
          AuthModule,
          UsersModule,
          ReagentsModule,
          MaterialsModule,
          EquipmentsModule,
          PurchasesModule,
          ResearchProjectsModule,
          SpacesModule,
          ReservationsModule,
          ClassScheduleModule,
          ManualsModule,
          LabInfoModule,
          EmailModule,
          WhatsAppModule,
          NotificationsModule,
          WebSocketModule,
          AnalyticsModule,
          CountersModule,
          InventoryHistoryModule,
          AssetsModule,
        ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
