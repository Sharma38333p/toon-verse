import Cartoon from '../models/Cartoon.js';
import User from '../models/User.js';

// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalCartoons = await Cartoon.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDownloadsAgg = await Cartoon.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadCount' } } },
    ]);
    const totalDownloads = totalDownloadsAgg[0]?.total || 0;

    const networksAgg = await Cartoon.aggregate([
      { $group: { _id: '$network', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalCartoons,
        totalUsers,
        totalDownloads,
        networks: networksAgg,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/admin/cartoons
export const createCartoon = async (req, res) => {
  try {
    const {
      title,
      network,
      networkId,
      description,
      rating,
      year,
      seasons,
      episodes,
      categories,
      poster,
      banner,
      youtubeTrailerId,
      downloadLinks,
      isFeatured,
      isTrending,
      isRecentlyAdded,
    } = req.body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await Cartoon.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Cartoon with this title already exists' });
    }

    const defaultLinks = downloadLinks && downloadLinks.length > 0 ? downloadLinks : [
      { quality: '1080p FHD', resolution: '1920x1080', size: '1.2 GB', format: 'MKV', downloadUrl: 'https://archive.org/download/sample-animation/1080p.mkv' },
      { quality: '720p HD', resolution: '1280x720', size: '650 MB', format: 'MP4', downloadUrl: 'https://archive.org/download/sample-animation/720p.mp4' },
      { quality: '480p SD', resolution: '854x480', size: '320 MB', format: 'MP4', downloadUrl: 'https://archive.org/download/sample-animation/480p.mp4' },
    ];

    const cartoon = await Cartoon.create({
      title,
      slug,
      network,
      networkId: networkId || network.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      rating: Number(rating) || 8.5,
      year: Number(year) || new Date().getFullYear(),
      seasons: Number(seasons) || 1,
      episodes: Number(episodes) || 26,
      categories: Array.isArray(categories) ? categories : [categories],
      poster,
      banner: banner || poster,
      youtubeTrailerId,
      downloadLinks: defaultLinks,
      isFeatured: !!isFeatured,
      isTrending: !!isTrending,
      isRecentlyAdded: !!isRecentlyAdded,
    });

    res.status(201).json({
      success: true,
      message: 'Cartoon added successfully',
      cartoon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/admin/cartoons/:id
export const updateCartoon = async (req, res) => {
  try {
    const { id } = req.params;
    const cartoon = await Cartoon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!cartoon) {
      return res.status(404).json({ success: false, message: 'Cartoon not found' });
    }

    res.json({
      success: true,
      message: 'Cartoon updated successfully',
      cartoon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/admin/cartoons/:id
export const deleteCartoon = async (req, res) => {
  try {
    const { id } = req.params;
    const cartoon = await Cartoon.findByIdAndDelete(id);

    if (!cartoon) {
      return res.status(404).json({ success: false, message: 'Cartoon not found' });
    }

    res.json({
      success: true,
      message: 'Cartoon deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
