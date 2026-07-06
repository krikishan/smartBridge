const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getAdminConfig,
  updateBanner,
  addBannerItem,
  deleteBannerItem,
  getAdminCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route — needed by the Home page for banners & categories
router.get('/config', getAdminConfig);

// All routes below require authentication + admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);

// Banner
router.put('/banner', updateBanner);
router.post('/banner', addBannerItem);
router.delete('/banner/:bannerId', deleteBannerItem);

// Categories
router.get('/categories', getAdminCategories);
router.post('/categories', addCategory);
router.put('/categories/:categoryId', updateCategory);
router.delete('/categories/:categoryId', deleteCategory);

module.exports = router;
