import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { EmailService } from '../email/email.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { generateReportTemplate } from './templates/report.template';

/**
 * Recurso /reports.
 *   POST /reports  -> guarda el reporte Y avisa por correo a la cuadrilla
 *   GET  /reports  -> lista todos los reportes
 *
 * El examen pide explicitamente que sea el controller quien orqueste
 * "guardar + enviar correo", por eso esa coordinacion vive aqui y no en el service.
 */
@Controller('reports')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  constructor(
    private readonly reportsService: ReportsService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  async create(@Body() createReportDto: CreateReportDto) {
    // 1) Guardar el reporte. Es el objetivo primario: si esto falla, la
    //    peticion falla (el error de TypeORM sube como 500).
    const report = await this.reportsService.create(createReportDto);

    // 2) Avisar por correo. Si el SMTP falla, el reporte YA quedo guardado:
    //    se registra el error pero la peticion responde 201 igual.
    try {
      const destinatarios =
        await this.reportsService.getNotificationRecipients();
      const html = generateReportTemplate(createReportDto);
      await this.emailService.sendEmail(
        destinatarios,
        `Nueva fuga reportada (severidad: ${createReportDto.severity})`,
        html,
      );
    } catch (error) {
      this.logger.error('No se pudo enviar el correo de aviso', error as Error);
    }

    return report;
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }
}
