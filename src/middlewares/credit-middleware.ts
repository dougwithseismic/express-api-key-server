// @@filename: src/middlewares/credit-middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from '../services/api-key-service';
import { logger } from '../config/logger';

const apiKeyService = new ApiKeyService();

export const checkAndDeductCredits = (creditCost: number) => async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  try {
    const updatedKeyData = await apiKeyService.deductCredits(apiKey, creditCost);

    // Attach updated API key data to the request for later use
    req.apiKey = updatedKeyData;

    next();
  } catch (error) {
    if (error instanceof Error && error.message === 'Insufficient credits') {
      return res.status(403).json({ error: 'Insufficient credits' });
    }
    logger.error('Error in credit check and deduction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
