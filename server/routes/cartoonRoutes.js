import express from 'express';
import {
  getCartoons,
  getFeatured,
  getTrending,
  getRecent,
  getCartoonByIdOrSlug,
  getNetworksSummary,
} from '../controllers/cartoonController.js';

const router = express.Router();

router.get('/', getCartoons);
router.get('/featured', getFeatured);
router.get('/trending', getTrending);
router.get('/recent', getRecent);
router.get('/networks/summary', getNetworksSummary);
router.get('/:idOrSlug', getCartoonByIdOrSlug);

export default router;
