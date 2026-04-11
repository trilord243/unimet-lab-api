import { Logger } from "@nestjs/common";
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Socket conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket desconectado: ${client.id}`);
  }

  /** Difunde un evento a todos los clientes conectados (panel del profesor). */
  broadcast(event: string, payload: any) {
    if (!this.server) return;
    this.server.emit(event, payload);
  }
}
