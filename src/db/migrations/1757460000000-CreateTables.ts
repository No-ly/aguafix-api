import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Crea las dos tablas del examen: "WATER_REPORT" y "SYSTEM_USER".
 * El timestamp del nombre del archivo va por delante para que TypeORM ejecute
 * las migraciones en orden. `up` aplica el cambio, `down` lo revierte.
 *
 * Los nombres de tabla y columna van entrecomillados: en Postgres, sin comillas
 * todo se convierte a minusculas, y el examen pide "WATER_REPORT" / "SYSTEM_USER".
 */
export class CreateTables1757460000000 implements MigrationInterface {
  name = 'CreateTables1757460000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "WATER_REPORT" (
        "id" SERIAL NOT NULL,
        "address" character varying NOT NULL,
        "description" character varying NOT NULL,
        "severity" character varying NOT NULL,
        "reporterPhone" character varying NOT NULL,
        "isResolved" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_WATER_REPORT_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "SYSTEM_USER" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "isNotificationEnabled" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_SYSTEM_USER_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_SYSTEM_USER_email" UNIQUE ("email")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "SYSTEM_USER"`);
    await queryRunner.query(`DROP TABLE "WATER_REPORT"`);
  }
}
