# AguaFix API

API para que los ciudadanos reporten fugas de agua en la vía pública. Al crear un
reporte se guarda en PostgreSQL **y** se envía un correo de aviso a la cuadrilla de
mantenimiento con los datos de la fuga.

Examen Parcial — Cómputo en la Nube.

## Stack

- **NestJS 11** + TypeScript
- **PostgreSQL** + **TypeORM** con migraciones (`synchronize: false`)
- Variables de entorno con **env-var** + **dotenv** (`src/config/envs.ts`)
- Contraseñas hasheadas con **bcryptjs**
- Correo con **nodemailer**
- Arquitectura por módulos: `módulo → controller → service → repository`
- DTOs con **class-validator** para la entrada de cada endpoint

## Endpoints

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | `CreateUserDto` | Alta de usuario. Rechaza correos repetidos. Devuelve el usuario sin `password`. |
| POST | `/auth/login` | `LoginDto` | Valida credenciales. `400 BadRequestException` si son inválidas. |
| POST | `/reports` | `CreateReportDto` | Guarda el reporte y envía el correo a la cuadrilla. |
| GET | `/reports` | — | Lista todos los reportes. |

### Entidades

- **`Report`** → tabla `WATER_REPORT`: `id`, `address`, `description`, `severity`
  (`low` / `medium` / `high`), `reporterPhone`, `isResolved` (default `false`),
  `createdAt` (timestamp automático).
- **`User`** → tabla `SYSTEM_USER`: `id`, `name`, `email` (único), `password`
  (hash bcrypt), `isNotificationEnabled` (default `true`).

## Estructura

```
src/
  config/envs.ts              # lectura y validación de variables de entorno
  db/
    data-source.ts            # opciones de TypeORM (runtime + CLI de migraciones)
    migrations/               # CreateTables: WATER_REPORT + SYSTEM_USER
  reports/
    reports.controller.ts     # POST guarda + dispara el correo; GET lista
    reports.service.ts        # acceso a datos + resolución de destinatarios
    reports.module.ts
    dtos/create-report.dto.ts
    entities/report.entity.ts
    templates/report.template.ts   # generateReportTemplate(dto): string (HTML)
  auth/
    auth.controller.ts        # /auth/register, /auth/login
    auth.service.ts           # hash y verificación con bcryptjs
    auth.module.ts
    dtos/ (create-user.dto.ts, login.dto.ts)
    entities/user.entity.ts
  email/
    email.service.ts          # transporter de nodemailer desde envs; sendEmail()
    email.module.ts
  app.module.ts
  main.ts                     # ValidationPipe global
```

## Cómo correr

Ver **[RUN.md](./RUN.md)** — instalación, base de datos, cuenta de correo de prueba
y guion del video.

Resumen:

```powershell
Copy-Item .env.example .env
docker compose up -d
npm install
npm run migration:run
npm run start:dev
```

## Notas de diseño

- **El correo no bloquea el reporte.** En `POST /reports` primero se guarda; si el
  envío SMTP falla, se registra el error en el log pero la petición responde `201`
  igual (el reporte ya quedó persistido).
- **Destinatarios del aviso:** el buzón fijo `MAINTENANCE_CREW_EMAIL` más cada
  usuario con `isNotificationEnabled = true`, sin duplicados.
- **Login neutro:** el mismo mensaje de error para "correo no existe" y "contraseña
  incorrecta", para no revelar cuál de los dos falló.
- **Sin JWT:** el examen no lo pide; `login` solo valida y devuelve el usuario.
