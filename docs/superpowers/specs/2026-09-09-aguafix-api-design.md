# AguaFix API — Diseño

**Fecha:** 2026-09-09
**Contexto:** Examen Parcial de Cómputo en la Nube. Entrega: repo Git + video.

## Objetivo

API para que los ciudadanos reporten fugas de agua en la vía pública. Al crear un
reporte, el sistema lo guarda en PostgreSQL y envía un correo de aviso a la
cuadrilla de mantenimiento con los datos de la fuga.

## Requisitos fijos (del enunciado)

- NestJS 11 + TypeScript.
- PostgreSQL + TypeORM con migraciones, `synchronize: false`.
- Variables de entorno con `env-var` + `dotenv` en `src/config/envs.ts`.
- Contraseñas hasheadas con `bcryptjs`.
- Correo con `nodemailer`.
- Arquitectura `módulo → controller → service → repository`.
- DTOs para la entrada de cada endpoint.

## Arquitectura

Tres módulos de funcionalidad + configuración compartida:

| Módulo | Responsabilidad | Depende de |
|--------|-----------------|------------|
| `ReportsModule` | Crear y listar reportes; resolver destinatarios del aviso | repo `Report`, repo `User` (lectura), `EmailModule` |
| `AuthModule` | Registro y login de usuarios; hash y verificación | repo `User` |
| `EmailModule` | Un `EmailService` con el transporter de nodemailer; `sendEmail(to, subject, template)` | `envs` |
| `config/envs.ts` | Lectura y validación de todas las variables de entorno | — |
| `db/data-source.ts` | Opciones de TypeORM, compartidas por el runtime y el CLI de migraciones | `envs`, entidades |

`main.ts` registra un `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`,
`transform`).

## Datos

### `Report` → tabla `"WATER_REPORT"`

| Campo | Tipo | Notas |
|-------|------|-------|
| id | serial PK | generado |
| address | varchar NOT NULL | dirección o referencia |
| description | varchar NOT NULL | qué se observa |
| severity | varchar NOT NULL | `low` / `medium` / `high` (lo valida el DTO) |
| reporterPhone | varchar NOT NULL | teléfono de contacto |
| isResolved | boolean NOT NULL DEFAULT false | |
| createdAt | timestamp NOT NULL DEFAULT now() | `@CreateDateColumn` |

### `User` → tabla `"SYSTEM_USER"`

| Campo | Tipo | Notas |
|-------|------|-------|
| id | serial PK | |
| name | varchar NOT NULL | |
| email | varchar NOT NULL UNIQUE | llave de login |
| password | varchar NOT NULL | hash bcrypt (60 chars) |
| isNotificationEnabled | boolean NOT NULL DEFAULT true | si recibe copia del aviso |

Los nombres de tabla y columna van entrecomillados en la migración porque Postgres,
sin comillas, los pasa a minúsculas y el enunciado pide esos nombres exactos.

Una sola migración `CreateTables` crea ambas tablas (`up`) y las tira (`down`).

## Endpoints

| Método | Ruta | DTO | Respuesta |
|--------|------|-----|-----------|
| POST | `/auth/register` | `CreateUserDto` (name, email, password ≥6, isNotificationEnabled?) | `201`, usuario sin `password`. `400` si el correo ya existe. |
| POST | `/auth/login` | `LoginDto` (email, password) | `200`, usuario sin `password`. `400 BadRequestException` si las credenciales son inválidas. |
| POST | `/reports` | `CreateReportDto` (address, description, severity∈{low,medium,high}, reporterPhone) | `201` con el reporte creado. |
| GET | `/reports` | — | `200`, array ordenado por id. |

## Flujo de `POST /reports`

El enunciado pide explícitamente que **el controller** orqueste guardar + enviar:

1. `reportsService.create(dto)` → guarda. Si falla, la petición falla (500).
2. `reportsService.getNotificationRecipients()` → `MAINTENANCE_CREW_EMAIL` +
   usuarios con `isNotificationEnabled = true`, sin duplicados, como string
   `"a@x, b@x"`.
3. `generateReportTemplate(dto)` → HTML (tabla con estilos inline: dirección,
   descripción, severidad con color, teléfono).
4. `emailService.sendEmail(destinatarios, asunto, html)`.
5. Si el paso 2–4 lanza, se registra en el log y **aun así** se responde `201` con
   el reporte (ya está persistido; el correo es secundario).

## Correo

`EmailService` arma el transporter una vez con `SMTP_HOST/PORT/SECURE/USER/PASS` de
`envs`. Para la demo se usa una cuenta de prueba **Ethereal**: no entrega correo a
nadie, lo deja en un buzón web y nodemailer devuelve una URL de preview que se
loguea (útil para el video).

## Variables de entorno (`src/config/envs.ts`)

`PORT` · `DB_HOST` `DB_PORT` `DB_USER` `DB_PASSWORD` `DB_NAME` · `SMTP_HOST`
`SMTP_PORT` `SMTP_SECURE` `SMTP_USER` `SMTP_PASS` · `MAIL_FROM`
`MAINTENANCE_CREW_EMAIL`. Todas `required()` salvo `PORT` (default 3000) y
`SMTP_SECURE` (default false).

## Fuera de alcance (YAGNI)

- JWT / sesiones — el enunciado no lo pide.
- Endpoint para marcar un reporte como resuelto.
- Tests automatizados (la verificación es la colección Bruno + el video).
- Rate limiting, i18n, paginación.

## Decisiones tomadas por el implementador (Santiago delegó: "hazlo tú")

1. **Git:** repo local + repositorio en GitHub.
2. **Destinatarios del correo:** buzón fijo del `.env` **y** usuarios opt-in, para
   que el campo `isNotificationEnabled` se use de verdad.
3. **Correo de prueba:** Ethereal, sin credenciales reales de Santiago.
4. **Colección Bruno** incluida para grabar el video (mismo patrón que `animals-api`).
