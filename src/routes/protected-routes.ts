// @@filename: src/routes/protected-routes.ts
import express from 'express';
import { apiKeyAuth } from '../middlewares/api-key-auth-middleware';
import { checkAndDeductCredits } from '../middlewares/credit-middleware';
import { checkLicense } from '../middlewares/license-check-middleware';
import { apiLimiter } from '../middlewares/rate-limit-middleware';

const router = express.Router();

router.use(apiLimiter);
router.use(apiKeyAuth);

// Free route, just requires API key
router.get('/free-resource', (req, res) => {
  res.json({ message: 'This is a free resource' });
});

// Low-cost route
router.get('/low-cost-resource', checkAndDeductCredits(1), (req, res) => {
  res.json({ message: 'This is a low-cost resource' });
});

// High-cost route
router.get('/high-cost-resource', checkAndDeductCredits(10), (req, res) => {
  res.json({ message: 'This is a high-cost resource' });
});

// Licensed route
router.get('/licensed-resource/:productId', checkLicense, (req, res) => {
  res.json({ message: 'This is a licensed resource' });
});

// Expensive licensed route
router.get('/expensive-licensed-resource/:productId', 
  checkLicense,
  checkAndDeductCredits(50),
  (req, res) => {
    res.json({ message: 'This is an expensive licensed resource' });
  }
);

export default router;
