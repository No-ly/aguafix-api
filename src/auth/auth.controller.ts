import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

/**
 * Recurso /auth.
 *   POST /auth/register -> crea un usuario (CreateUserDto)
 *   POST /auth/login    -> valida credenciales (LoginDto);
 *                          400 BadRequestException si son invalidas
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // login exitoso responde 200, no 201
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
