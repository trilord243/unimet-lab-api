import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

/**
 * Cliente del WhatsApp Business API (Meta Graph), idéntico al de centromundox.
 * Variables de entorno:
 *   WHATSAPP_API_TOKEN
 *   WHATSAPP_BUSINESS_PHONE  (phone_number_id)
 *   WHATSAPP_API_VERSION     (default v22.0)
 */
@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly apiToken = process.env.WHATSAPP_API_TOKEN;
  private readonly businessPhone = process.env.WHATSAPP_BUSINESS_PHONE;
  private readonly apiVersion = process.env.WHATSAPP_API_VERSION || "v22.0";

  async sendMessage(to: string, message: string): Promise<any> {
    if (!this.apiToken || !this.businessPhone) {
      this.logger.warn("WhatsApp no configurado; mensaje no enviado");
      return { skipped: true };
    }
    try {
      const response = await axios({
        method: "POST",
        url: `https://graph.facebook.com/${this.apiVersion}/${this.businessPhone}/messages`,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        data: {
          messaging_product: "whatsapp",
          to,
          text: { body: message },
        },
      });
      this.logger.log(`Mensaje WhatsApp enviado a ${to}`);
      return response.data;
    } catch (err: any) {
      this.logger.error(
        `Error WhatsApp a ${to}: ${JSON.stringify(err.response?.data || err.message)}`,
      );
      throw err;
    }
  }

  async notifyAdminNewRequest(
    adminPhone: string,
    type: "espacio" | "equipo" | "reactivo",
    studentName: string,
    summary: string,
  ) {
    return this.sendMessage(
      adminPhone,
      `🔔 *Nueva solicitud de ${type}*\nEstudiante: ${studentName}\n${summary}\n\nIngresa al panel para gestionarla.`,
    );
  }

  async notifyStudentResolved(
    studentPhone: string,
    type: string,
    status: "approved" | "rejected",
    reason?: string,
  ) {
    const msg =
      status === "approved"
        ? `✅ Tu solicitud de ${type} fue *aprobada*.`
        : `❌ Tu solicitud de ${type} fue rechazada${reason ? `: ${reason}` : "."}`;
    return this.sendMessage(studentPhone, msg);
  }
}
