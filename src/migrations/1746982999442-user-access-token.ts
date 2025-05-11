import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAccessToken1746982999442 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "refresh_token" varchar NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "refresh_token";
        `);
    }

}
