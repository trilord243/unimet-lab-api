import { Injectable, Logger } from "@nestjs/common";
import { EmailService } from "../email/email.service";
import { WhatsAppService } from "../whatsapp/whatsapp.service";
import { NotificationsGateway } from "../websocket/notifications.gateway";

/**
 * Orquestador multicanal: cuando ocurre un evento (nueva reserva,
 * aprobación, stock bajo) se notifica al admin/profesor por
 * email + WhatsApp + WebSocket en tiempo real.
 *
 * Lee correos/teléfonos del admin desde variables de entorno:
 *   ADMIN_NOTIFICATION_EMAIL
 *   ADMIN_NOTIFICATION_WHATSAPP
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  private readonly adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  private readonly adminPhone = process.env.ADMIN_NOTIFICATION_WHATSAPP;

  constructor(
    private readonly email: EmailService,
    private readonly whatsapp: WhatsAppService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async notifyNewSpaceReservation(reservation: any) {
    const summary = `Espacio: ${reservation.spaceId}\nFecha: ${reservation.date}\nBloques: ${reservation.timeBlocks?.join(", ")}`;
    await this.dispatchToAdmin("espacio", "Estudiante", summary);
    this.gateway.broadcast("reservation:new", { kind: "space", reservation });
  }

  async notifyNewEquipmentReservation(reservation: any) {
    const summary = `Equipo: ${reservation.equipmentId}\nFecha: ${reservation.date}\nBloques: ${reservation.timeBlocks?.join(", ")}`;
    await this.dispatchToAdmin("equipo", "Estudiante", summary);
    this.gateway.broadcast("reservation:new", { kind: "equipment", reservation });
  }

  async notifyNewReagentRequest(request: any) {
    const summary = `Reactivo: ${request.reagentId}\nCantidad: ${request.quantity} ${request.unit}\nJustificación: ${request.justification ?? "-"}`;
    await this.dispatchToAdmin("reactivo", "Estudiante", summary);
    this.gateway.broadcast("reservation:new", { kind: "reagent", request });
  }

  async notifyReservationResolved(
    kind: "space" | "equipment" | "reagent",
    record: any,
  ) {
    this.gateway.broadcast("reservation:resolved", { kind, record });
    // TODO: lookup studentEmail/studentPhone from UsersService y enviar
    this.logger.log(
      `Solicitud ${kind} ${record._id} → ${record.status}`,
    );
  }

  async notifyLowStock(reagentName: string, qty: number, unit: string) {
    if (this.adminEmail) {
      await this.email.sendLowStockAlert(this.adminEmail, reagentName, qty, unit);
    }
    if (this.adminPhone) {
      await this.whatsapp.sendMessage(
        this.adminPhone,
        `⚠️ Stock bajo: ${reagentName} (${qty} ${unit})`,
      );
    }
  }

  // ----------------------------------------------------------------
  private async dispatchToAdmin(
    type: "espacio" | "equipo" | "reactivo",
    studentName: string,
    details: string,
  ) {
    if (this.adminEmail) {
      try {
        await this.email.sendNewReservationToAdmin(
          this.adminEmail,
          type,
          studentName,
          details,
        );
      } catch (e) {
        this.logger.error(`Error email admin: ${e}`);
      }
    }
    if (this.adminPhone) {
      try {
        await this.whatsapp.notifyAdminNewRequest(
          this.adminPhone,
          type,
          studentName,
          details,
        );
      } catch (e) {
        this.logger.error(`Error whatsapp admin: ${e}`);
      }
    }
  }
}
