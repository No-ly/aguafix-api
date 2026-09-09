import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Usuario del sistema (personal del municipio / cuadrilla).
 * Mapea a la tabla "SYSTEM_USER".
 */
@Entity('SYSTEM_USER')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // No puede repetirse: es la llave con la que se hace login.
  @Column({ unique: true })
  email: string;

  // Se guarda SIEMPRE hasheada con bcryptjs, nunca en texto plano.
  @Column()
  password: string;

  // Si esta en true, esta persona recibe copia del correo de cada fuga nueva.
  @Column({ default: true })
  isNotificationEnabled: boolean;
}
