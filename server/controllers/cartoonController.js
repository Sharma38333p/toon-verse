import Cartoon from '../models/Cartoon.js';

// @route   GET /api/cartoons
export const getCartoons = async (req, res) => {
  try {
    const { search, network, category, sort, limit = 50, page = 1 } = req.query;

    const query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { network: searchRegex },
        { categories: searchRegex },
      ];
    }

    if (network && network !== 'all') {
      query.networkId = network.toLowerCase();
    }

    if (category && category !== 'all') {
      query.categories = { $in: [new RegExp(category, 'i')] };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'year') sortOption = { year: -1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === 'popular') sortOption = { viewsCount: -1, rating: -1 };

    const cartoons = await Cartoon.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Cartoon.countDocuments(query);

    res.json({
      success: true,
      count: cartoons.length,
      total,
      page: Number(page),
      cartoons,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/cartoons/featured
export const getFeatured = async (req, res) => {
  try {
    let cartoon = await Cartoon.findOne({ isFeatured: true });
    if (!cartoon) {
      cartoon = await Cartoon.findOne().sort({ rating: -1 });
    }
    res.json({ success: true, cartoon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/cartoons/trending
export const getTrending = async (req, res) => {
  try {
    const cartoons = await Cartoon.find({ isTrending: true }).limit(12);
    res.json({ success: true, cartoons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/cartoons/recent
export const getRecent = async (req, res) => {
  try {
    const cartoons = await Cartoon.find({ isRecentlyAdded: true }).limit(10);
    res.json({ success: true, cartoons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/cartoons/:idOrSlug
export const getCartoonByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let cartoon;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      cartoon = await Cartoon.findById(idOrSlug);
    }
    if (!cartoon) {
      cartoon = await Cartoon.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!cartoon) {
      return res.status(404).json({ success: false, message: 'Cartoon not found' });
    }

    // Increment views asynchronously
    cartoon.viewsCount += 1;
    await cartoon.save();

    // Get related cartoons from the same network or category
    const related = await Cartoon.find({
      _id: { $ne: cartoon._id },
      $or: [{ networkId: cartoon.networkId }, { categories: { $in: cartoon.categories } }],
    }).limit(6);

    res.json({
      success: true,
      cartoon,
      related,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/cartoons/networks/summary
export const getNetworksSummary = async (req, res) => {
  try {
    const counts = await Cartoon.aggregate([
      { $group: { _id: '$networkId', count: { $sum: 1 }, networkName: { $first: '$network' } } },
    ]);
    res.json({ success: true, networks: counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
