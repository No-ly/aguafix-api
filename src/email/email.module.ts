import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * Expone EmailService para que otros modulos (ReportsModule) lo inyecten.
 */
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
