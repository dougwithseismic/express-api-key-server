// @@filename: src/utils/swagger.ts
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { Express } from "express";
import path from "path";

const swaggerDocument = YAML.load(path.join(__dirname, "../../openapi.yaml"));

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
