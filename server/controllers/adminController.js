const Admin = require('../models/Admin');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    // Monthly revenue for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [totalUsers, totalProducts, totalOrders, revenueAgg, statusAgg, monthlyRevenue, recentOrders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      // Aggregate total revenue instead of loading all orders into memory
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      // Aggregate status counts
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { orderedDate: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$orderedDate' },
              month: { $month: '$orderedDate' },
            },
            revenue: { $sum: '$total' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Order.find()
        .sort({ orderedDate: -1 })
        .limit(5)
        .populate('userId', 'name email'),
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;
    const statusCounts = statusAgg.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        statusCounts,
        monthlyRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin config (banner + categories)
// @route   GET /api/admin/config
const getAdminConfig = async (req, res, next) => {
  try {
    let config = await Admin.findOne();
    if (!config) {
      config = await Admin.create({ banner: [], categories: [] });
    }
    res.json({ success: true, config });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/admin/banner
const updateBanner = async (req, res, next) => {
  try {
    let config = await Admin.findOne();
    if (!config) {
      config = new Admin({ banner: [], categories: [] });
    }
    config.banner = req.body.banner;
    await config.save();
    res.json({ success: true, banner: config.banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Add banner item
// @route   POST /api/admin/banner
const addBannerItem = async (req, res, next) => {
  try {
    let config = await Admin.findOne();
    if (!config) {
      config = new Admin({ banner: [], categories: [] });
    }
    config.banner.push(req.body);
    await config.save();
    res.status(201).json({ success: true, banner: config.banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner item
// @route   DELETE /api/admin/banner/:bannerId
const deleteBannerItem = async (req, res, next) => {
  try {
    const config = await Admin.findOne();
    if (!config) {
      res.status(404);
      throw new Error('Config not found');
    }
    config.banner = config.banner.filter(
      (b) => b._id.toString() !== req.params.bannerId
    );
    await config.save();
    res.json({ success: true, banner: config.banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories
// @route   GET /api/admin/categories
const getAdminCategories = async (req, res, next) => {
  try {
    let config = await Admin.findOne();
    if (!config) {
      config = await Admin.create({ banner: [], categories: [] });
    }
    res.json({ success: true, categories: config.categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Add category
// @route   POST /api/admin/categories
const addCategory = async (req, res, next) => {
  try {
    let config = await Admin.findOne();
    if (!config) {
      config = new Admin({ banner: [], categories: [] });
    }
    config.categories.push(req.body);
    await config.save();
    res.status(201).json({ success: true, categories: config.categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:categoryId
const updateCategory = async (req, res, next) => {
  try {
    const config = await Admin.findOne();
    if (!config) {
      res.status(404);
      throw new Error('Config not found');
    }
    const cat = config.categories.id(req.params.categoryId);
    if (!cat) {
      res.status(404);
      throw new Error('Category not found');
    }
    Object.assign(cat, req.body);
    await config.save();
    res.json({ success: true, categories: config.categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:categoryId
const deleteCategory = async (req, res, next) => {
  try {
    const config = await Admin.findOne();
    if (!config) {
      res.status(404);
      throw new Error('Config not found');
    }
    config.categories = config.categories.filter(
      (c) => c._id.toString() !== req.params.categoryId
    );
    await config.save();
    res.json({ success: true, categories: config.categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
