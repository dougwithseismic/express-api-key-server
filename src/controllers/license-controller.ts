// @@filename: src/controllers/license-controller.ts
import { Request, Response } from 'express';
import { LicenseService } from '../services/license-service';
import { logger } from '../config/logger';

export class LicenseController {
  private licenseService: LicenseService;

  constructor() {
    this.licenseService = new LicenseService();
  }

  async createLicense(req: Request, res: Response) {
    try {
      const licenseData = req.body;
      const license = await this.licenseService.createLicense(licenseData);
      res.status(201).json(license);
    } catch (error) {
      logger.error('Error in createLicense:', error);
      res.status(500).json({ error: 'Failed to create license' });
    }
  }

  async getLicense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const license = await this.licenseService.getLicense(id);
      if (license) {
        res.json(license);
      } else {
        res.status(404).json({ error: 'License not found' });
      }
    } catch (error) {
      logger.error('Error in getLicense:', error);
      res.status(500).json({ error: 'Failed to fetch license' });
    }
  }

  async updateLicense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedLicense = await this.licenseService.updateLicense(id, updateData);
      res.json(updatedLicense);
    } catch (error) {
      logger.error('Error in updateLicense:', error);
      res.status(500).json({ error: 'Failed to update license' });
    }
  }

  async revokeLicense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const revokedLicense = await this.licenseService.revokeLicense(id);
      res.json(revokedLicense);
    } catch (error) {
      logger.error('Error in revokeLicense:', error);
      res.status(500).json({ error: 'Failed to revoke license' });
    }
  }

  async getLicensesByApiKey(req: Request, res: Response) {
    try {
      const { apiKeyId } = req.params;
      const licenses = await this.licenseService.getLicensesByApiKey(apiKeyId);
      res.json(licenses);
    } catch (error) {
      logger.error('Error in getLicensesByApiKey:', error);
      res.status(500).json({ error: 'Failed to fetch licenses' });
    }
  }
}
