import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1716392874996 implements MigrationInterface {
    name = 'Init1716392874996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "secret_note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "note" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_afca0ead19e5ef8e15f13531277" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "secret_note"`);
    }

}
