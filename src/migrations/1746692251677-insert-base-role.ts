import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedRolesWithFixedUUIDs1746633000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      INSERT INTO "roles" (id, name)
      VALUES 
        ('11111111-1111-1111-1111-111111111111', 'user'),
        ('22222222-2222-2222-2222-222222222222', 'admin');
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DELETE FROM "roles"
      WHERE id IN (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222'
      );
    `);
    }
}
