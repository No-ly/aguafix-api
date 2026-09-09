import { DataSource, DataSourceOptions } from 'typeorm';
import { envs } from '../config/envs';
import { Report } from '../reports/entities/report.entity';
import { User } from '../auth/entities/user.entity';

/**
 * Opciones compartidas por dos consumidores:
 *  - Nest en runtime (TypeOrmModule.forRoot en app.module.ts)
 *  - El CLI de TypeORM para correr/generar migraciones (usa el export default)
 *
 * synchronize: false -> el esquema NO se crea solo; se controla con migraciones.
 * migrations apunta al JS ya compilado en dist/, por eso los scripts de npm
 * hacen `nest build` antes de invocar el CLI.
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  entities: [Report, User],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
