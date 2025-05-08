import { MigrationInterface, QueryRunner } from "typeorm";

export class EchoUser1746631036547 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(`
            CREATE Table "roles" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" VARCHAR(50) UNIQUE NOT NULL,
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "nickname" VARCHAR(255)  UNIQUE NOT NULL,
                "name" VARCHAR(255),
                "password" TEXT NOT NULL,
                "comment" TEXT,
                "address" TEXT,
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "roleId" uuid REFERENCES roles(id) NOT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"; DROP TABLE "roles"`);
    }

}
