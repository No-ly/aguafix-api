import { CreateReportDto } from '../dtos/create-report.dto';

/**
 * Arma el cuerpo HTML del correo que recibe la cuadrilla de mantenimiento.
 *
 * Se usan estilos inline y una tabla porque los clientes de correo (Gmail,
 * Outlook) ignoran hojas de estilo externas y buena parte del CSS moderno.
 * Una <table> con `style=""` en cada celda es lo que se ve igual en todos.
 */
export function generateReportTemplate(dto: CreateReportDto): string {
  // Etiqueta y color segun la severidad, para que se lea de un vistazo.
  const severidad: Record<string, { texto: string; color: string }> = {
    low: { texto: 'Baja', color: '#2e7d32' },
    medium: { texto: 'Media', color: '#f9a825' },
    high: { texto: 'Alta', color: '#c62828' },
  };
  const nivel = severidad[dto.severity] ?? {
    texto: dto.severity,
    color: '#455a64',
  };

  // Escapa texto del ciudadano para que no rompa el HTML ni inyecte etiquetas.
  const esc = (valor: string): string =>
    valor
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const fila = (etiqueta: string, valor: string): string => `
        <tr>
          <td style="padding:10px 14px;border:1px solid #e0e0e0;background:#fafafa;font-weight:bold;width:170px;vertical-align:top;">${etiqueta}</td>
          <td style="padding:10px 14px;border:1px solid #e0e0e0;vertical-align:top;">${valor}</td>
        </tr>`;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Nuevo reporte de fuga de agua</title>
</head>
<body style="margin:0;padding:0;background:#eceff1;font-family:Arial,Helvetica,sans-serif;color:#212121;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eceff1;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:#01579b;padding:20px 24px;color:#ffffff;font-size:20px;font-weight:bold;">
              AguaFix &mdash; Aviso de fuga en via publica
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">
                Se registro un nuevo reporte ciudadano de fuga de agua. Datos para la cuadrilla:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                ${fila('Direccion / referencia', esc(dto.address))}
                ${fila('Descripcion', esc(dto.description))}
                ${fila(
                  'Severidad',
                  `<span style="display:inline-block;padding:3px 10px;border-radius:4px;color:#ffffff;background:${nivel.color};font-weight:bold;">${esc(
                    nivel.texto,
                  )}</span>`,
                )}
                ${fila('Telefono de contacto', esc(dto.reporterPhone))}
              </table>
              <p style="margin:20px 0 0;font-size:12px;color:#757575;line-height:1.5;">
                Correo automatico de AguaFix. No respondas a este mensaje.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
