import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { User } from '../auth/entities/user.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { EmailModule } from '../email/email.module';

/**
 * forFeature registra los repositorios de Report y User en este modulo.
 * User entra solo en modo lectura (a quien notificar); el alta de usuarios
 * la maneja AuthModule.
 * EmailModule aporta EmailService para el aviso del POST /reports.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Report, User]), EmailModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
