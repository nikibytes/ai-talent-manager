import { defineConfig } from 'drizzle-kit';

const dbFile = process.env.DB_FILE_NAME ?? './data/ai-talent-manager.db';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: dbFile,
  },
});
