import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

/**
 * Unico punto de salida de correo de la app.
 * El transporter se arma una sola vez desde las variables de entorno (envs).
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  // createTransport arma un cliente SMTP reutilizable; no abre conexion hasta
  // el primer sendMail.
  private readonly transporter = nodemailer.createTransport({
    host: envs.SMTP_HOST,
    port: envs.SMTP_PORT,
    secure: envs.SMTP_SECURE, // true = puerto 465; false = 587/2525 con STARTTLS
    auth: {
      user: envs.SMTP_USER,
      pass: envs.SMTP_PASS,
    },
  });

  /**
   * Envia un correo HTML.
   * @param to      destinatario(s); acepta "a@x.com" o "a@x.com, b@x.com"
   * @param subject asunto
   * @param template cuerpo del correo ya armado como HTML
   */
  async sendEmail(to: string, subject: string, template: string): Promise<void> {
    const info = await this.transporter.sendMail({
      from: envs.MAIL_FROM,
      to,
      subject,
      html: template,
    });

    this.logger.log(`Correo enviado (${info.messageId}) a: ${to}`);

    // Con cuentas de prueba Ethereal, nodemailer devuelve una URL para ver
    // el correo en el navegador. Util para el video.
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      this.logger.log(`Ver correo (Ethereal): ${preview}`);
    }
  }
}
