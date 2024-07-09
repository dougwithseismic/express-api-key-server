import { Client } from "pg";
import fs from "fs";
import path from "path";
import { logger } from "../config/logger";
import dotenv from "dotenv";

dotenv.config();

const initTables = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    logger.info("Connected to the database");

    const sqlFilePath = path.join(__dirname, "create_tables.sql");
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    await client.query(sqlContent);
    logger.info("Tables created successfully");
  } catch (error) {
    logger.error("Error initializing tables:", error);
  } finally {
    await client.end();
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
