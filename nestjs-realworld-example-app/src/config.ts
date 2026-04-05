import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  type: 'mysql',
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  entities: ['src/**/**.entity{.ts,.js}'],
  synchronize: true,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey', // ← добавили сюда
};

export default config;