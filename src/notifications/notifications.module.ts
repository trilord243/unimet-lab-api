import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { EmailModule } from "../email/email.module";
import { WhatsAppModule } from "../whatsapp/whatsapp.module";
import { WebSocketModule } from "../websocket/websocket.module";

@Module({
  imports: [EmailModule, WhatsAppModule, WebSocketModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
