import { Injectable, Logger } from "@nestjs/common";
import { EmailService } from "../email/email.service";
import { WhatsAppService } from "../whatsapp/whatsapp.service";
import { NotificationsGateway } from "../websocket/notifications.gateway";
import { UsersService } from "../users/users.service";

/**
 * Orquestador multicanal: cuando ocurre un evento (nueva reserva,
 * aprobación, stock bajo) se notifica al admin/profesor por
 * email + WhatsApp + WebSocket en tiempo real, y al estudiante
 * cuando su solicitud es resuelta.
 *
 * Variables de entorno para el admin:
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
    private readonly users: UsersService,
  ) {}

  async notifyNewSpaceReservation(reservation: any) {
    const student = await this.safeLookup(reservation.userId);
    const studentName = student?.name ?? "Estudiante";
    const summary = `Espacio: ${reservation.spaceId}\nFecha: ${new Date(reservation.date).toLocaleDateString("es-VE")}\nBloques: ${reservation.timeBlocks?.join(", ")}`;
    await this.dispatchToAdmin("espacio", studentName, summary);
    this.gateway.broadcast("reservation:new", { kind: "space", reservation });
  }

  async notifyNewEquipmentReservation(reservation: any) {
    const student = await this.safeLookup(reservation.userId);
    const studentName = student?.name ?? "Estudiante";
    const summary = `Equipo: ${reservation.equipmentId}\nFecha: ${new Date(reservation.date).toLocaleDateString("es-VE")}\nBloques: ${reservation.timeBlocks?.join(", ")}`;
    await this.dispatchToAdmin("equipo", studentName, summary);
    this.gateway.broadcast("reservation:new", { kind: "equipment", reservation });
  }

  async notifyNewReagentRequest(request: any) {
    const student = await this.safeLookup(request.userId);
    const studentName = student?.name ?? "Estudiante";
    const summary = `Reactivo: ${request.reagentId}\nCantidad: ${request.quantity} ${request.unit}\nJustificación: ${request.justification ?? "-"}`;
    await this.dispatchToAdmin("reactivo", studentName, summary);
    this.gateway.broadcast("reservation:new", { kind: "reagent", request });
  }

  async notifyReservationResolved(
    kind: "space" | "equipment" | "reagent",
    record: any,
  ) {
    this.gateway.broadcast("reservation:resolved", { kind, record });
    this.logger.log(`Solicitud ${kind} ${record._id} → ${record.status}`);

    const student = await this.safeLookup(record.userId);
    if (!student) return;

    const typeLabel =
      kind === "space" ? "espacio" : kind === "equipment" ? "equipo" : "reactivo";
    const status = record.status as "approved" | "rejected";
    if (status !== "approved" && status !== "rejected") return;

    // Email al estudiante
    if (student.email) {
      try {
        await this.email.sendReservationResolvedToStudent(
          student.email,
          student.name,
          typeLabel,
          status,
          record.rejectionReason,
        );
      } catch (e) {
        this.logger.error(`Error email estudiante: ${e}`);
      }
    }

    // WhatsApp al estudiante si tiene teléfono
    if (student.phone) {
      try {
        await this.whatsapp.notifyStudentResolved(
          student.phone,
          typeLabel,
          status,
          record.rejectionReason,
        );
      } catch (e) {
        this.logger.error(`Error whatsapp estudiante: ${e}`);
      }
    }
  }

  async notifyLowStock(reagentName: string, qty: number, unit: string) {
    if (this.adminEmail) {
      await this.email.sendLowStockAlert(
        this.adminEmail,
        reagentName,
        qty,
        unit,
      );
    }
    if (this.adminPhone) {
      await this.whatsapp.sendMessage(
        this.adminPhone,
        `⚠️ Stock bajo: ${reagentName} (${qty} ${unit})`,
      );
    }
  }

  // ----------------------------------------------------------------
  private async safeLookup(userId: string) {
    if (!userId) return null;
    try {
      return await this.users.findById(userId);
    } catch (e) {
      this.logger.warn(`No se pudo buscar usuario ${userId}: ${e}`);
      return null;
    }
  }

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
