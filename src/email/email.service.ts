import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

/**
 * Servicio de correo basado en Resend (mismo enfoque que centromundox).
 * Plantillas con la paleta de marca del Lab UNIMET.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  // Paleta heredada del estilo centromundox
  private readonly brandPrimary = "#1859A9";
  private readonly brandOrange = "#FF8200";
  private readonly brandSecondary = "#003087";

  private readonly fromAddress =
    process.env.RESEND_FROM ||
    "Lab Procesos Separación <lab@example.com>";

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");
  }

  async sendVerificationEmail(to: string, name: string, code: string) {
    return this.send(
      to,
      "Verifica tu cuenta — Laboratorio de Procesos de Separación",
      this.wrap(
        `<h2>¡Hola ${name}!</h2>
         <p>Tu código de verificación es:</p>
         <p style="font-size:32px;font-weight:bold;color:${this.brandPrimary};text-align:center;">${code}</p>`,
      ),
    );
  }

  async sendNewReservationToAdmin(
    adminEmail: string,
    type: "espacio" | "equipo" | "reactivo",
    studentName: string,
    details: string,
  ) {
    return this.send(
      adminEmail,
      `Nueva solicitud de ${type} pendiente`,
      this.wrap(
        `<h2>Nueva solicitud de ${type}</h2>
         <p><strong>${studentName}</strong> ha enviado una solicitud que requiere tu aprobación.</p>
         <pre style="background:#f5f5f5;padding:12px;border-radius:6px;">${details}</pre>
         <p>Ingresa al panel del profesor para gestionarla.</p>`,
      ),
    );
  }

  async sendReservationResolvedToStudent(
    to: string,
    studentName: string,
    type: string,
    status: "approved" | "rejected",
    reason?: string,
  ) {
    const titulo =
      status === "approved"
        ? `¡Tu solicitud de ${type} fue APROBADA!`
        : `Tu solicitud de ${type} fue rechazada`;
    const cuerpo =
      status === "approved"
        ? `<p>Hola ${studentName}, tu solicitud ha sido aprobada. Recuerda revisar las normativas de seguridad.</p>`
        : `<p>Hola ${studentName}, tu solicitud no pudo ser aprobada${reason ? `: <em>${reason}</em>` : "."}</p>`;
    return this.send(to, titulo, this.wrap(`<h2>${titulo}</h2>${cuerpo}`));
  }

  async sendLowStockAlert(adminEmail: string, reagentName: string, qty: number, unit: string) {
    return this.send(
      adminEmail,
      `Stock bajo: ${reagentName}`,
      this.wrap(
        `<h2>Stock bajo de reactivo</h2>
         <p>El reactivo <strong>${reagentName}</strong> tiene solo ${qty} ${unit} disponibles.</p>
         <p>Considere registrar una compra requerida.</p>`,
      ),
    );
  }

  // ----------------------------------------------------------------
  private async send(to: string, subject: string, html: string) {
    try {
      return await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject,
        html,
      });
    } catch (err) {
      this.logger.error(`Error enviando correo a ${to}: ${err}`);
      throw err;
    }
  }

  private wrap(inner: string) {
    return `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
        <div style="background-color:${this.brandSecondary};padding:15px;border-radius:8px 8px 0 0;text-align:center;margin-bottom:20px;">
          <h1 style="color:white;margin:0;font-size:22px;">Lab<span style="color:${this.brandOrange};">UNIMET</span></h1>
          <p style="color:#cfd9ec;margin:4px 0 0;font-size:13px;">Laboratorio de Procesos de Separación</p>
        </div>
        <div style="color:#333;line-height:1.5;">${inner}</div>
        <div style="margin-top:30px;padding-top:15px;border-top:1px solid #eee;text-align:center;color:#999;font-size:12px;">
          Universidad Metropolitana — Caracas, Venezuela
        </div>
      </div>
    `;
  }
}
