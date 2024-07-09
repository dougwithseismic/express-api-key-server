// @@filename: src/middlewares/api-key-auth-middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from '../services/api-key-service';
import { logger } from '../config/logger';
import { ApiKey } from '../models/api-key-model';

const apiKeyService = new ApiKeyService();

declare global {
  namespace Express {
    interface Request {
      apiKey?: ApiKey;
    }
  }
}

export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  try {
    const keyData = await apiKeyService.getApiKey(apiKey);

    if (!keyData || !keyData.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive API key' });
    }

    // Update last used timestamp
    await apiKeyService.updateApiKey(apiKey, { lastUsed: new Date() });

    // Attach API key data to the request for later use
    req.apiKey = keyData;

    next();
  } catch (error) {
    logger.error('Error in API key authentication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
