import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { User } from '../auth/entities/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { envs } from '../config/envs';

/**
 * Logica de datos de los reportes.
 * Tambien resuelve a quien hay que avisar por correo cuando entra una fuga.
 */
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    // Solo lectura: se usa para saber que usuarios quieren notificaciones.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(dto: CreateReportDto): Promise<Report> {
    // isResolved (false) y createdAt (now) los ponen la entidad y la BD.
    const report = this.reportRepository.create(dto);
    return this.reportRepository.save(report);
  }

  findAll(): Promise<Report[]> {
    return this.reportRepository.find({ order: { id: 'ASC' } });
  }

  /**
   * Lista de destinatarios del correo de aviso, como string separado por comas:
   *  - el buzon fijo de la cuadrilla (MAINTENANCE_CREW_EMAIL)
   *  - mas cada usuario registrado con isNotificationEnabled = true
   * Se quitan duplicados.
   */
  async getNotificationRecipients(): Promise<string> {
    const usuarios = await this.userRepository.find({
      where: { isNotificationEnabled: true },
      select: { email: true },
    });

    const correos = new Set<string>([envs.MAINTENANCE_CREW_EMAIL]);
    for (const u of usuarios) {
      correos.add(u.email);
    }
    return [...correos].join(', ');
  }
}
