import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * Body de POST /auth/register.
 * La contrasena llega en texto plano por HTTPS y el AuthService la hashea
 * con bcryptjs antes de guardarla; nunca se persiste tal cual.
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'email no tiene un formato valido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'password debe tener al menos 6 caracteres' })
  password: string;

  // Opcional: si no viene, la entidad la deja en true por defecto.
  @IsOptional()
  @IsBoolean()
  isNotificationEnabled?: boolean;
}
