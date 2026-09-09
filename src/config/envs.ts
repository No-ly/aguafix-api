import 'dotenv/config';
import * as env from 'env-var';

/**
 * Punto unico de lectura de variables de entorno.
 * `env-var` valida y castea: si falta una variable requerida, la app
 * revienta al arrancar con un error claro en vez de fallar despues en runtime.
 */
export const envs = {
  // --- HTTP ---
  PORT: env.get('PORT').default(3000).asPortNumber(),

  // --- Base de datos (coincide con compose.yaml) ---
  DB_HOST: env.get('DB_HOST').required().asString(),
  DB_PORT: env.get('DB_PORT').required().asPortNumber(),
  DB_USER: env.get('DB_USER').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),

  // --- Correo (nodemailer) ---
  SMTP_HOST: env.get('SMTP_HOST').required().asString(),
  SMTP_PORT: env.get('SMTP_PORT').required().asPortNumber(),
  // true solo para el puerto 465 (SSL). Para 587/2525 va en false (STARTTLS).
  SMTP_SECURE: env.get('SMTP_SECURE').default('false').asBool(),
  SMTP_USER: env.get('SMTP_USER').required().asString(),
  SMTP_PASS: env.get('SMTP_PASS').required().asString(),
  // Remitente que ve la cuadrilla en el "De:".
  MAIL_FROM: env.get('MAIL_FROM').required().asString(),
  // Buzon fijo de la cuadrilla de mantenimiento.
  MAINTENANCE_CREW_EMAIL: env.get('MAINTENANCE_CREW_EMAIL').required().asString(),
};
