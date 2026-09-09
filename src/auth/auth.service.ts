import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

// Lo que la API devuelve del usuario: nunca incluye la contrasena.
export type PublicUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Alta de usuario. Rechaza correos repetidos y guarda la contrasena hasheada.
   */
  async register(dto: CreateUserDto): Promise<PublicUser> {
    const yaExiste = await this.userRepository.findOneBy({ email: dto.email });
    if (yaExiste) {
      throw new BadRequestException('Ya existe un usuario con ese correo');
    }

    // 10 rondas de sal: balance estandar entre seguridad y velocidad.
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      isNotificationEnabled: dto.isNotificationEnabled,
    });
    const guardado = await this.userRepository.save(user);

    return this.sinPassword(guardado);
  }

  /**
   * Valida credenciales. Mismo mensaje de error si el correo no existe o si la
   * contrasena no coincide, para no revelar cual de los dos fallo.
   */
  async login(dto: LoginDto): Promise<PublicUser> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) {
      throw new BadRequestException('Correo o contrasena incorrectos');
    }

    const coincide = await bcrypt.compare(dto.password, user.password);
    if (!coincide) {
      throw new BadRequestException('Correo o contrasena incorrectos');
    }

    return this.sinPassword(user);
  }

  private sinPassword(user: User): PublicUser {
    // Se desestructura para descartar `password` y devolver el resto.
    const { password: _omitida, ...publico } = user;
    return publico;
  }
}
