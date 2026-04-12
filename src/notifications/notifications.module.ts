import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { EmailModule } from "../email/email.module";
import { WhatsAppModule } from "../whatsapp/whatsapp.module";
import { WebSocketModule } from "../websocket/websocket.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [EmailModule, WhatsAppModule, WebSocketModule, UsersModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
