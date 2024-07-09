// @@filename: src/routes/license-routes.ts
import express from 'express';
import { LicenseController } from '../controllers/license-controller';
import { validate } from '../middlewares/validation-middleware';
import { createLicenseSchema, updateLicenseSchema } from '../models/license-model';
import { apiKeyAuth } from '../middlewares/api-key-auth-middleware';
import { apiLimiter } from '../middlewares/rate-limit-middleware';

const router = express.Router();
const licenseController = new LicenseController();

router.use(apiLimiter);
router.use(apiKeyAuth);

router.post('/', validate(createLicenseSchema), (req, res) => licenseController.createLicense(req, res));
router.get('/:id', (req, res) => licenseController.getLicense(req, res));
router.put('/:id', validate(updateLicenseSchema), (req, res) => licenseController.updateLicense(req, res));
router.delete('/:id', (req, res) => licenseController.revokeLicense(req, res));
router.get('/by-api-key/:apiKeyId', (req, res) => licenseController.getLicensesByApiKey(req, res));

export default router;
