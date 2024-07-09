// @@filename: src/controllers/api-key-controller.ts
import { Request, Response } from "express";
import { ApiKeyService } from "../services/api-key-service";
import { logger } from "../config/logger";
import { CreateApiKeyDto, UpdateApiKeyDto } from "../models/api-key-model";

export class ApiKeyController {
  private apiKeyService: ApiKeyService;

  constructor() {
    this.apiKeyService = new ApiKeyService();
  }

  async createApiKey(req: Request, res: Response) {
    try {
      const { userId, credits, isActive = true } = req.body;
      const createApiKeyDto: CreateApiKeyDto = {
        userId,
        credits,
      };
      const apiKey = await this.apiKeyService.createApiKey(createApiKeyDto);
      res.status(201).json(apiKey);
    } catch (error) {
      logger.error("Error in createApiKey:", error);
      res.status(500).json({ error: "Failed to create API key" });
    }
  }

  async getAllApiKeys(req: Request, res: Response) {
    try {
      const apiKeys = await this.apiKeyService.getAllApiKeys();
      res.json(apiKeys);
    } catch (error) {
      logger.error("Error in getAllApiKeys:", error);
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  }

  async getApiKey(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const apiKey = await this.apiKeyService.getApiKey(key);
      if (apiKey) {
        res.json(apiKey);
      } else {
        res.status(404).json({ error: "API key not found" });
      }
    } catch (error) {
      logger.error("Error in getApiKey:", error);
      res.status(500).json({ error: "Failed to fetch API key" });
    }
  }

  async updateApiKey(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const updateDto: UpdateApiKeyDto = req.body;
      const updatedApiKey = await this.apiKeyService.updateApiKey(
        key,
        updateDto
      );
      res.json(updatedApiKey);
    } catch (error) {
      logger.error("Error in updateApiKey:", error);
      res.status(500).json({ error: "Failed to update API key" });
    }
  }

  async deactivateApiKey(req: Request, res: Response) {
    try {
      const { key } = req.params;
      await this.apiKeyService.deactivateApiKey(key);
      res.status(204).send();
    } catch (error) {
      logger.error("Error in deactivateApiKey:", error);
      res.status(500).json({ error: "Failed to deactivate API key" });
    }
  }

  async addCredits(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const { amount } = req.body;
      const updatedApiKey = await this.apiKeyService.addCredits(key, amount);
      res.json(updatedApiKey);
    } catch (error) {
      logger.error("Error in addCredits:", error);
      res.status(500).json({ error: "Failed to add credits" });
    }
  }
}
