import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Body de POST /auth/login. Solo correo y contrasena.
 */
export class LoginDto {
  @IsEmail({}, { message: 'email no tiene un formato valido' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
