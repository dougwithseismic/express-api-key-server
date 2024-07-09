import express from "express";
import dotenv from "dotenv";
import path from "path";
import apiKeyRoutes from "./routes/api-key-routes";
import licenseRoutes from "./routes/license-routes";
import protectedRoutes from "./routes/protected-routes";
import { errorHandler } from "./middlewares/error-handler";
import { logger } from "./config/logger";
import { initSupabase } from "./utils/supabase-client";
import { redis } from "./utils/redis-client";
import { setupSwagger } from "./utils/swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Supabase client
initSupabase();

// Setup Swagger
setupSwagger(app);

// Routes
app.use("/api/keys", apiKeyRoutes);
app.use("/api/licenses", licenseRoutes);
app.use("/api/protected", protectedRoutes);

// Serve the control panel
if (process.env.NODE_ENV === "production") {
  // Serve the built control panel in production
  app.use(
    "/control-panel/",
    express.static(path.join(__dirname, "../dist/control-panel"))
  );
  app.get("/control-panel/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/control-panel/index.html"));
  });
} else {
  // Proxy requests to the Vite dev server in development
  const { createProxyMiddleware } = require("http-proxy-middleware");
  app.use(
    "/control-panel",
    createProxyMiddleware({
      target: "http://localhost:3000",
      changeOrigin: true,
      ws: true,
    })
  );
}

// Error handling middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
  logger.info(
    `Control Panel is available at http://localhost:5173/control-panel/`
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
    redis.quit();
    process.exit(0);
  });
});

export default app;
