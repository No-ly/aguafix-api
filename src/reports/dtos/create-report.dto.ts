import { IsIn, IsNotEmpty, IsString } from 'class-validator';

/**
 * Forma y reglas del body de POST /reports.
 * El ValidationPipe global (main.ts) responde 400 si algo no cumple
 * o si llegan campos de mas (whitelist).
 *
 * isResolved y createdAt NO se reciben: los pone el servidor.
 */
export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // Solo se aceptan estos tres niveles de severidad.
  @IsIn(['low', 'medium', 'high'], {
    message: 'severity debe ser low, medium o high',
  })
  severity: string;

  @IsString()
  @IsNotEmpty()
  reporterPhone: string;
}
