// @@filename: src/scripts/init-tables.ts
import { getSupabase, initSupabase } from "../utils/supabase-client";
import { logger } from "../config/logger";
import dotenv from "dotenv";

dotenv.config();

const initTables = async () => {
  initSupabase();
  const supabase = getSupabase();

  const apiKeyTableSQL = `
    CREATE TABLE IF NOT EXISTS api_keys (
      id UUID PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      userId UUID NOT NULL,
      credits INTEGER NOT NULL DEFAULT 0,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastUsed TIMESTAMP,
      isActive BOOLEAN NOT NULL DEFAULT TRUE
    );
  `;

  const licenseTableSQL = `
    CREATE TABLE IF NOT EXISTS licenses (
      id UUID PRIMARY KEY,
      apiKeyId UUID NOT NULL REFERENCES api_keys(id),
      productId TEXT NOT NULL,
      expiresAt TIMESTAMP NOT NULL,
      isActive BOOLEAN NOT NULL DEFAULT TRUE
    );
  `;

  try {
    const { error: apiKeyError } = await supabase.rpc("execute_sql", {
      sql: apiKeyTableSQL,
    });
    if (apiKeyError) {
      logger.error("Error creating api_keys table:", apiKeyError);
    } else {
      logger.info("api_keys table created successfully");
    }

    const { error: licenseError } = await supabase.rpc("execute_sql", {
      sql: licenseTableSQL,
    });
    if (licenseError) {
      logger.error("Error creating licenses table:", licenseError);
    } else {
      logger.info("licenses table created successfully");
    }
  } catch (error) {
    logger.error("Error initializing tables:", error);
  }
};

initTables()
  .then(() => {
    logger.info("Table initialization complete");
    process.exit(0);
  })
  .catch((error) => {
    logger.error("Error initializing tables:", error);
    process.exit(1);
  });
