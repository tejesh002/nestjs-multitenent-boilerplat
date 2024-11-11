import { MigrationInterface, QueryRunner } from 'typeorm';

export class Admin1731320179159 implements MigrationInterface {
  name = 'Admin1731320179159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "master_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', CONSTRAINT "UQ_8b34de5a32962513b79adb2e53a" UNIQUE ("slug"), CONSTRAINT "PK_fff5fe91f5c27b6172116b0f169" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "master_account"`);
  }
}
