/**
 * Turso Database Client
 *
 * Creates a libSQL client connected to your Turso database.
 * Uses environment variables for configuration.
 *
 * For local development, you can use a local SQLite file
 * by setting TURSO_DATABASE_URL=file:local.db
 */

import { createClient } from '@libsql/client';

if (!process.env.TURSO_DATABASE_URL) {
  console.warn(
    '⚠️  TURSO_DATABASE_URL not set. Using local SQLite file: file:local.db'
  );
}

export const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});
