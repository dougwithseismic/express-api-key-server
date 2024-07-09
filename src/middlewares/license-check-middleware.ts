// @@filename: src/middlewares/license-check-middleware.ts
import { Request, Response, NextFunction } from 'express';
import { LicenseService } from '../services/license-service';
import { logger } from '../config/logger';

const licenseService = new LicenseService();

export const checkLicense = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-Key');
  const { productId } = req.params;

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  try {
    const licenses = await licenseService.getLicensesByApiKey(apiKey);
    const hasValidLicense = licenses.some(license => 
      license.productId === productId && license.isActive && new Date(license.expiresAt) > new Date()
    );

    if (!hasValidLicense) {
      return res.status(403).json({ error: 'No valid license for this product' });
    }

    next();
  } catch (error) {
    logger.error('Error in license check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
