import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Un reporte de fuga de agua en la via publica.
 * Mapea a la tabla "WATER_REPORT" (nombre tal cual lo pide el examen; Postgres
 * lo guarda con mayusculas porque TypeORM entrecomilla el identificador).
 */
@Entity('WATER_REPORT')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  // Direccion o referencia de donde esta la fuga.
  @Column()
  address: string;

  // Que se observa (agua saliendo del pavimento, medidor roto, etc.).
  @Column()
  description: string;

  // low / medium / high. El valor lo valida el CreateReportDto.
  @Column()
  severity: string;

  // Telefono de contacto de quien reporta.
  @Column()
  reporterPhone: string;

  // Arranca en false; la cuadrilla lo marca como resuelto despues.
  @Column({ default: false })
  isResolved: boolean;

  // Fecha del reporte. La pone la base de datos al insertar.
  @CreateDateColumn()
  createdAt: Date;
}
