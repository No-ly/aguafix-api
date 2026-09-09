# Cómo correr AguaFix API y grabar el video

## 0. Requisitos

- Node 18 o superior
- Docker Desktop **corriendo**
- [Bruno](https://www.usebruno.com/) instalado (app de escritorio)

## 1. Preparar (una sola vez)

```powershell
cd aguafix-api
Copy-Item .env.example .env      # luego edita las líneas SMTP_* (ver paso 1.1)
docker compose up -d             # levanta Postgres en localhost:5432
npm install
npm run migration:run           # compila y crea las tablas WATER_REPORT y SYSTEM_USER
```

### 1.1 Cuenta de correo para la demo (Ethereal)

El envío de correo usa una cuenta de prueba **Ethereal**: no entrega nada a nadie,
guarda los correos en un buzón web y la API te imprime un enlace para verlos.

```powershell
npm run mail:setup
```

Copia las 5 líneas `SMTP_*` que imprime y pégalas en tu `.env` (reemplazando las
que trae de ejemplo). El `.env` que está en la máquina ya tiene una cuenta válida;
solo genera otra si esa dejó de funcionar.

> Para ver el buzón en el navegador: <https://ethereal.email/login> con el
> `SMTP_USER` y `SMTP_PASS` de tu `.env`.

## 2. Levantar la API

```powershell
npm run start:dev
```

Debe aparecer `API escuchando en http://localhost:3000` y las 4 rutas mapeadas:
`POST /auth/register`, `POST /auth/login`, `POST /reports`, `GET /reports`.

## 3. Abrir la colección en Bruno

1. Bruno → **Open Collection** → carpeta `aguafix-api/bruno/AguaFixAPI`.
2. Arriba a la derecha, environment **local** (`baseUrl = http://localhost:3000`).

---

## 4. Guion del video (~2–3 min)

Graba pantalla completa: la API en una terminal + Bruno + una pestaña del navegador
para el correo. Sugerencia de narración:

| # | Acción | Qué mostrar / decir |
|---|--------|---------------------|
| 1 | Estructura del proyecto + `npm run start:dev` corriendo | "NestJS 11 + TypeORM + Postgres. Tablas `WATER_REPORT` y `SYSTEM_USER` creadas por migración, `synchronize: false`. Variables de entorno con env-var en `src/config/envs.ts`." |
| 2 | **1 Registrar usuario** → Send | `201`. La respuesta trae `id` pero **no** `password` (se guardó hasheada con bcryptjs). |
| 3 | (opcional) en la terminal de Docker: `docker exec aguafix-db psql -U postgres -d aguafix -c 'SELECT email, left(password,7) FROM \"SYSTEM_USER\";'` | Se ve el hash `$2b$10$…`, nunca la contraseña en claro. |
| 4 | **2 Login correcto** → Send | `200`, devuelve el usuario sin `password`. |
| 5 | **3 Login invalido** → Send | `400 BadRequestException` con `"Correo o contrasena incorrectos"`. |
| 6 | **4 Crear reporte** → Send | `201` con el reporte: `isResolved: false` y `createdAt` puestos por el servidor. En la terminal de la API aparece `Correo enviado …` y `Ver correo (Ethereal): https://…`. |
| 7 | Abrir ese enlace de Ethereal en el navegador | Se ve el correo HTML con dirección, descripción, severidad (con color) y teléfono de contacto. |
| 8 | **6 Listar reportes** → Send | `200`, array con el reporte recién creado. |
| 9 | **5 Crear reporte invalido** → Send | `400` con `"severity debe ser low, medium o high"` (validación del DTO). |

> **Repetir la demo desde cero:** vacía las tablas y reinicia los ids con
> ```powershell
> docker exec aguafix-db psql -U postgres -d aguafix -c 'TRUNCATE TABLE \"WATER_REPORT\", \"SYSTEM_USER\" RESTART IDENTITY;'
> ```

## 5. Respaldo del video

Corre la colección por CLI (no necesita Bruno abierto):

```powershell
cd aguafix-api/bruno/AguaFixAPI
npx @usebruno/cli run --env local
```

Debe dar **6/6 requests** y **15/15 assertions** en verde. Graba esa corrida como
plan B si el video principal falla.
