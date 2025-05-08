import { DataSource } from 'typeorm';
import * as path from 'path';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'postgres',
  entities: ['dist/**/**.entity{.ts,.js}'],
  migrations: [path.join(__dirname, process.env.MIGRATION_PATH ?? 'src/migrations/**/*{.ts,.js}')],
  synchronize: false,
  migrationsRun: true,
});