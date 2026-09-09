import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

/**
 * Modulo raiz. forRoot abre la conexion a Postgres una sola vez para toda la app
 * y reutiliza exactamente las mismas opciones que el CLI de migraciones.
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ReportsModule,
    AuthModule,
    EmailModule,
  ],
})
export class AppModule {}
