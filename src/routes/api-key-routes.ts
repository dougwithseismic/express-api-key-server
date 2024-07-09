import express from "express";
import { ApiKeyController } from "../controllers/api-key-controller";
import { validate } from "../middlewares/validation-middleware";
import {
  createApiKeySchema,
  updateApiKeySchema,
} from "../models/api-key-model";
import { apiLimiter } from "../middlewares/rate-limit-middleware";
import { apiKeyAuth } from "../middlewares/api-key-auth-middleware";

const router = express.Router();
const apiKeyController = new ApiKeyController();

router.use(apiLimiter);

router.post(
  "/",
  validate(createApiKeySchema),
  apiKeyController.createApiKey.bind(apiKeyController)
);
router.get("/", apiKeyController.getAllApiKeys.bind(apiKeyController));
router.get(
  "/:key",
  apiKeyAuth,
  apiKeyController.getApiKey.bind(apiKeyController)
);
router.put(
  "/:key",
  apiKeyAuth,
  validate(updateApiKeySchema),
  apiKeyController.updateApiKey.bind(apiKeyController)
);
router.delete(
  "/:key",
  apiKeyAuth,
  apiKeyController.deactivateApiKey.bind(apiKeyController)
);
router.post(
  "/:key/add-credits",
  apiKeyAuth,
  apiKeyController.addCredits.bind(apiKeyController)
);

export default router;
